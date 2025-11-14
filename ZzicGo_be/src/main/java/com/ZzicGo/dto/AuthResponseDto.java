package com.ZzicGo.dto;

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

    public record LoginResponse(
            String accessToken,
            String refreshToken,
            boolean isNewUser
    ) {}
}
