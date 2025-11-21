package com.ZzicGo.exception;

import com.ZzicGo.global.BaseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum UserException implements BaseCode {
    NOT_EXIST_USER("USER_404","존재하지 않는 사용자입니다.",HttpStatus.NOT_FOUND),
    NO_PERMISSION("USER403", "권한이 없습니다.", HttpStatus.FORBIDDEN),
    INVALID_GENDER("USER400", "성별 형식이 적절하지 않습니다.", HttpStatus.BAD_REQUEST),
    INVALID_NICKNAME("USER400", "닉네임 형식이 적절하지 않습니다.", HttpStatus.BAD_REQUEST);
    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

}
