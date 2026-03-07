package com.ZzicGo.service.auth;

import com.ZzicGo.config.jwt.JwtProvider;
import com.ZzicGo.config.oauth.OAuthProperties;
import com.ZzicGo.domain.user.*;
import com.ZzicGo.dto.oauth.AuthResponseDto;
import com.ZzicGo.dto.oauth.OAuthProfile;
import com.ZzicGo.repository.UserRepository;
import com.ZzicGo.util.RandomNicknameGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OAuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final OAuthProperties oauthProperties;

    private final RestTemplate restTemplate = new RestTemplate();

    public AuthResponseDto.LoginResponse login(
            Provider provider,
            String code,
            String state
    ) {

        String accessToken = requestToken(provider, code, state);

        OAuthProfile profile = requestProfile(provider, accessToken);

        boolean isNew = false;

        User user = userRepository
                .findByProviderAndProviderId(provider, profile.getId())
                .orElse(null);

        if (user == null) {
            isNew = true;
            user = createUser(provider, profile);
        } else {
            user.updateLastLogin();
            userRepository.save(user);
        }

        String accessJwt =
                jwtProvider.createAccessToken(user.getId(), user.getProviderId(), user.getRole().name());

        String refreshJwt =
                jwtProvider.createRefreshToken(user.getId(), user.getProviderId(), user.getRole().name());

        return new AuthResponseDto.LoginResponse(accessJwt, refreshJwt, isNew);
    }

    private String requestToken(
            Provider provider,
            String code,
            String state
    ) {

        switch (provider) {

            case NAVER -> {

                OAuthProperties.ProviderConfig config = oauthProperties.getNaver();

                String url =
                        config.getTokenUri()
                                + "?grant_type=authorization_code"
                                + "&client_id=" + config.getClientId()
                                + "&client_secret=" + config.getClientSecret()
                                + "&redirect_uri=" + config.getRedirectUri()
                                + "&code=" + code
                                + "&state=" + state;

                AuthResponseDto.NaverTokenResponse response =
                        restTemplate.getForObject(url, AuthResponseDto.NaverTokenResponse.class);

                return response.access_token();
            }

            case KAKAO -> {

                OAuthProperties.ProviderConfig config = oauthProperties.getKakao();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

                MultiValueMap<String, String> params = new LinkedMultiValueMap<>();

                params.add("grant_type", "authorization_code");
                params.add("client_id", config.getClientId());
                params.add("redirect_uri", config.getRedirectUri());
                params.add("code", code);

                if (config.getClientSecret() != null) {
                    params.add("client_secret", config.getClientSecret());
                }

                HttpEntity<MultiValueMap<String, String>> request =
                        new HttpEntity<>(params, headers);


                ResponseEntity<AuthResponseDto.KakaoTokenResponse> response =
                        restTemplate.exchange(
                                config.getTokenUri(),
                                HttpMethod.POST,
                                request,
                                AuthResponseDto.KakaoTokenResponse.class
                        );

                return response.getBody().access_token();
            }
        }

        throw new RuntimeException("Unsupported provider");
    }

    private OAuthProfile requestProfile(
            Provider provider,
            String accessToken
    ) {

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        switch (provider) {

            case NAVER -> {

                OAuthProperties.ProviderConfig config = oauthProperties.getNaver();

                ResponseEntity<AuthResponseDto.NaverProfileResponse> response =
                        restTemplate.exchange(
                                config.getProfileUri(),
                                HttpMethod.GET,
                                request,
                                AuthResponseDto.NaverProfileResponse.class
                        );

                AuthResponseDto.NaverProfileResponse.Response profile =
                        response.getBody().response();

                return new OAuthProfile(
                        profile.id(),
                        profile.email()
                );
            }

            case KAKAO -> {

                OAuthProperties.ProviderConfig config = oauthProperties.getKakao();

                ResponseEntity<AuthResponseDto.KakaoProfileResponse> response =
                        restTemplate.exchange(
                                config.getProfileUri(),
                                HttpMethod.GET,
                                request,
                                AuthResponseDto.KakaoProfileResponse.class
                        );

                AuthResponseDto.KakaoProfileResponse profile = response.getBody();

                String email = null;

                if (profile.kakao_account() != null) {
                    email = profile.kakao_account().email();
                }

                return new OAuthProfile(
                        profile.id().toString(),
                        email
                );
            }
        }

        throw new RuntimeException("Unsupported provider");
    }

    private User createUser(
            Provider provider,
            OAuthProfile profile
    ) {

        User newUser = User.builder()
                .email(profile.getEmail())
                .nickname(RandomNicknameGenerator.generate())
                .provider(provider)
                .providerId(profile.getId())
                .status(Status.ACTIVE)
                .role(Role.USER)
                .lastLoginAt(LocalDateTime.now())
                .build();

        return userRepository.save(newUser);
    }
}