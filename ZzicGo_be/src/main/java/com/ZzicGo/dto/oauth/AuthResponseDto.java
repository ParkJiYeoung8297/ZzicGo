package com.ZzicGo.dto.oauth;

import java.util.List;

public class AuthResponseDto {

    public record LoginResponse(
            String accessToken,
            String refreshToken,
            boolean isNewUser
    ) {
    }

    /**
     * 네이버 로그인
     **/

    public record NaverTokenResponse(
            String access_token,
            String refresh_token,
            String token_type,
            Integer expires_in
    ) {
    }

    public record NaverProfileResponse(
            String resultcode,
            String message,
            Response response
    ) {
        public record Response(
                String id,
                String email,
                String gender,
                String birthday,
                String birthyear
        ) {
        }
    }

    public record NaverAgreementResponse(
            String result,
            String accessToken,
            List<AgreementInfos> agreementInfos
    ) {
        public record AgreementInfos(
                String termCode,
                String clientId,
                String agreeDate
        ) {
        }
    }

    /**
     * 카카오 로그인
     **/
    public record KakaoTokenResponse(
            String access_token,
            String token_type,
            String refresh_token,
            Integer expires_in
    ) {
    }

    public record KakaoProfileResponse(
            Long id,
            KakaoAccount kakao_account
    ) {
        public record KakaoAccount(
                String email
        ) {
        }
    }

}
