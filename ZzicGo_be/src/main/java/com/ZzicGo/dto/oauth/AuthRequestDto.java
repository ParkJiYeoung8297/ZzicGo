package com.ZzicGo.dto.oauth;

public class AuthRequestDto {

    public record RefreshRequest(
            String refreshToken
    ) {}
}