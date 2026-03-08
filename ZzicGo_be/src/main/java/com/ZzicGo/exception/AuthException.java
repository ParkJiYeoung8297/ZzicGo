package com.ZzicGo.exception;

import org.springframework.http.HttpStatus;

import com.ZzicGo.global.BaseCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AuthException implements BaseCode{
    INVALID_REFRESH_TOKEN("AUTH_401","유효하지 않거나 만료된 토큰입니다.",HttpStatus.UNAUTHORIZED),
    NO_REFRESH_TOKEN("AUTH_404","토큰이 존재하지 않습니다.",HttpStatus.NOT_FOUND);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
