package com.ZzicGo.dto;

import java.util.List;

public class AuthResponseDto {

    public record NaverTokenResponse(
            String access_token,
            String refresh_token,
            String token_type,
            Integer expires_in
    ) {}

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
        ) {}
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
        ) {}
    }

    public record LoginResponse(
            String accessToken,
            String refreshToken,
            boolean isNewUser
    ) {}
}
