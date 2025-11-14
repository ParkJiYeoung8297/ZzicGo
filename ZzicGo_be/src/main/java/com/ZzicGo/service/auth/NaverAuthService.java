package com.ZzicGo.service.auth;

import com.ZzicGo.config.jwt.JwtProvider;
import com.ZzicGo.domain.user.*;
import com.ZzicGo.dto.AuthResponseDto;
import com.ZzicGo.repository.UserRepository;
import com.ZzicGo.util.RandomNicknameGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NaverAuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final RestTemplate restTemplate = new RestTemplate();

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
