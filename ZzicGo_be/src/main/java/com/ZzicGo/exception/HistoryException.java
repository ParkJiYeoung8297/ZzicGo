package com.ZzicGo.exception;

import com.ZzicGo.global.BaseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum HistoryException implements BaseCode {
    // 인증글 관련
    HISTORY_ALREADY_TODAY("HISTORY409", "오늘은 이미 인증글을 작성했습니다.",HttpStatus.CONFLICT),
    HISTORY_IMAGE_LIMIT("HISTORY400", "사진은 최대 3장까지만 업로드할 수 있습니다.", HttpStatus.BAD_REQUEST),
    HISTORY_CONTENT_EMPTY("HISTORY400", "인증글 내용은 빈값일 수 없습니다.", HttpStatus.BAD_REQUEST);


    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
