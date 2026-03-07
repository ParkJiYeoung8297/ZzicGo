package com.ZzicGo.dto.oauth;

public record TokenRefreshResponse(
        String accessToken,
        String refreshToken
) {}
