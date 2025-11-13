package com.ZzicGo.controller;

import com.ZzicGo.dto.AuthResponseDto;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.service.auth.NaverAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    private final NaverAuthService naverAuthService;

    @GetMapping("/naver")
    public CustomResponse<AuthResponseDto.LoginResponse> login(
            @RequestParam String code,
            @RequestParam String state
    ) {
        AuthResponseDto.LoginResponse response = naverAuthService.login(code, state);
        return CustomResponse.ok(response);
    }
}
