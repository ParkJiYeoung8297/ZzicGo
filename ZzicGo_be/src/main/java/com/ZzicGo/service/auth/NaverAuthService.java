package com.ZzicGo.service.auth;

import com.ZzicGo.config.jwt.JwtProvider;
import com.ZzicGo.domain.terms.TermType;
import com.ZzicGo.domain.terms.Terms;
import com.ZzicGo.domain.terms.TermsAgreement;
import com.ZzicGo.domain.user.*;
import com.ZzicGo.dto.AuthResponseDto;
import com.ZzicGo.exception.TermsException;
import com.ZzicGo.global.CustomException;
import com.ZzicGo.repository.TermsAgreementRepository;
import com.ZzicGo.repository.TermsRepository;
import com.ZzicGo.repository.UserRepository;
import com.ZzicGo.util.RandomNicknameGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import com.ZzicGo.dto.AuthResponseDto.NaverAgreementResponse.AgreementInfos;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class NaverAuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final RestTemplate restTemplate = new RestTemplate();
    private final TermsRepository termsRepository;
    private final TermsAgreementRepository termsAgreementRepository;

    @Value("${naver.client-id}")
    private String clientId;

    @Value("${naver.client-secret}")
    private String clientSecret;

    @Value("${naver.redirect-uri}")
    private String redirectUri;

    public AuthResponseDto.LoginResponse login(String code, String state) {

        // 1) 네이버 토큰
        AuthResponseDto.NaverTokenResponse NaverTokenResponse = requestNaverToken(code, state);

        // 2) 네이버 프로필
        AuthResponseDto.NaverProfileResponse.Response profile =
                requestNaverProfile(NaverTokenResponse.access_token());

        // 3) DB 조회 or 신규 가입
        boolean isNew = false;
        User user = userRepository.findByProviderAndProviderId(Provider.NAVER, profile.id())
                .orElse(null);

        if (user == null) {
            isNew = true;
            user = createUser(profile);
            List<AgreementInfos> agreements =
                    requestNaverAgreement(NaverTokenResponse.access_token());
            createTermAgreements(user, agreements);

        } else {
            user.updateLastLogin();
            userRepository.save(user);
        }

        // 4) JWT 발급
        String accessToken = jwtProvider.createAccessToken(user.getId(), user.getProviderId() , user.getRole().name());
        String refreshToken = jwtProvider.createRefreshToken(user.getId(), user.getProviderId(), user.getRole().name());

        return new AuthResponseDto.LoginResponse(accessToken, refreshToken, isNew);
    }

    protected AuthResponseDto.NaverTokenResponse requestNaverToken(String code, String state) {

        String url = "https://nid.naver.com/oauth2.0/token"
                + "?grant_type=authorization_code"  // 발급
                + "&client_id=" + clientId
                + "&client_secret=" + clientSecret
                + "&redirect_uri=" + redirectUri
                + "&code=" + code
                + "&state=" + state;

        return restTemplate.getForObject(url, AuthResponseDto.NaverTokenResponse.class);
    }

    protected List<AgreementInfos>  requestNaverAgreement(String accessToken) {

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        HttpEntity<Void> httpEntity = new HttpEntity<>(headers);

        ResponseEntity<AuthResponseDto.NaverAgreementResponse> response =
                restTemplate.exchange(
                        "https://openapi.naver.com/v1/nid/agreement",
                        HttpMethod.GET,
                        httpEntity,
                        AuthResponseDto.NaverAgreementResponse.class
                );

        return response.getBody().agreementInfos();
    }

    protected AuthResponseDto.NaverProfileResponse.Response requestNaverProfile(String accessToken) {

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        HttpEntity<Void> httpEntity = new HttpEntity<>(headers);

        ResponseEntity<AuthResponseDto.NaverProfileResponse> response =
                restTemplate.exchange(
                        "https://openapi.naver.com/v1/nid/me",
                        HttpMethod.GET,
                        httpEntity,
                        AuthResponseDto.NaverProfileResponse.class
                );

        return response.getBody().response();
    }

    protected User createUser(AuthResponseDto.NaverProfileResponse.Response profile) {
        User newUser = User.builder()
                .email(profile.email())
                .nickname(RandomNicknameGenerator.generate())
                .gender(parseGender(profile.gender()))
                .birth(parseBirth(profile.birthyear(), profile.birthday()))
                .status(Status.ACTIVE)
                .provider(Provider.NAVER)
                .providerId(profile.id())
                .role(Role.USER)
                .lastLoginAt(LocalDateTime.now())
                .build();

        return userRepository.save(newUser);
    }

    @Transactional
    public void createTermAgreements(
            User user,
            List<AgreementInfos> agreementInfos
    ) {
        for (AgreementInfos info : agreementInfos) {

            // e.g. "SERVICE_100"
            String[] parts = info.termCode().split("_");

            String termTypeStr = parts[0];
            TermType termTypeEnum;
            try {
                termTypeEnum = TermType.valueOf(termTypeStr);
            } catch (IllegalArgumentException e) {
                // 잘못된 termType이면 skip
                continue;
            }
            String versionRaw = parts.length > 1 ? parts[1] : null;

            // versionRaw = "100" 처럼 들어옴 → "1.0.0" 으로 변환
            String version = null;

            if (versionRaw != null && versionRaw.length() == 3) {
                version = versionRaw.charAt(0) + "."
                        + versionRaw.charAt(1) + "."
                        + versionRaw.charAt(2);
            }

            // 2) terms 테이블에서 찾기
            Terms terms = termsRepository.findByTermTypeAndVersion(termTypeEnum, version)
                    .orElseThrow(() -> new CustomException(TermsException.TERMS_NOT_FOUND));

            // 3) 이미 동의한 기록이 있으면 패스
            boolean exists = termsAgreementRepository.existsByUserAndTerms(user, terms);
            if (exists) continue;

            // 4) agreeDate → LocalDateTime 변환
            String agreeTime = info.agreeDate();

            // 모든 공백 normalize
            agreeTime = agreeTime.trim().replaceAll("\\s+", " ");

            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern("hh:mm:ss.SSS a MM/dd/yyyy", Locale.ENGLISH);

            LocalDateTime agreedAt = LocalDateTime.parse(agreeTime, formatter);
//            LocalDateTime agreedAt = LocalDateTime.parse(info.agreeDate());

            // 5) 저장
            TermsAgreement agreement = TermsAgreement.builder()
                    .user(user)
                    .terms(terms)
                    .isAgreed(true)
                    .agreedAt(agreedAt) // 네이버 동의 시각
                    .build();

            termsAgreementRepository.save(agreement);

        }
    }



    private Gender parseGender(String gender) {
        if (gender == null) return Gender.NONE;
        return gender.equalsIgnoreCase("M") ? Gender.MALE : Gender.FEMALE;
    }

    private LocalDate parseBirth(String year, String birthday) {
        try {
            return LocalDate.parse(year + "-" + birthday);
        } catch (Exception e) {
            return null;
        }
    }
}
