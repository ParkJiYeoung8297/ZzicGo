package com.ZzicGo.controller;

import com.ZzicGo.domain.user.Provider;
import com.ZzicGo.dto.oauth.AuthResponseDto;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.service.auth.OAuthService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth", description = "소셜 로그인 인증")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/z1/auth")
public class AuthController {
    private final OAuthService oAuthService;

    @GetMapping("/naver")
    public CustomResponse<AuthResponseDto.LoginResponse> login(
            @RequestParam String code,
            @RequestParam String state
    ) {

        AuthResponseDto.LoginResponse response = oAuthService.login(Provider.NAVER, code, state);
        return CustomResponse.ok(response);
    }

    @GetMapping("/kakao")
    public CustomResponse<AuthResponseDto.LoginResponse> login(
            @RequestParam String code
    ) {
        AuthResponseDto.LoginResponse response = oAuthService.login(Provider.KAKAO, code, null);
        return CustomResponse.ok(response);
    }
}


