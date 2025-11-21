package com.ZzicGo.exception;

import com.ZzicGo.global.BaseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum TermsException implements BaseCode {
    TERMS_NOT_FOUND("TERMS404","해당 약관이 존재하지 않습니다.",HttpStatus.NOT_FOUND),
    CANNOT_UNAGREE_REQUIRED_TERMS("TERMS403","필수 약관은 거부할 수 없습니다.",HttpStatus.FORBIDDEN);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}

