package com.ZzicGo.exception;

import com.ZzicGo.global.BaseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum UserException implements BaseCode {
    NOT_EXIST_USER("USER_404","존재하지 않는 사용자입니다.",HttpStatus.NOT_FOUND);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

}
