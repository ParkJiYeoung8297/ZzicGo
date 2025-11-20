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
    HISTORY_NOT_FOUND("HISTORY404", "해당 기록이 존재하지 않습니다.", HttpStatus.NOT_FOUND),
    HISTORY_IMAGE_NOT_NULL("HISTORY400", "사진은 최소 1장 업로드해야합니다.", HttpStatus.BAD_REQUEST),
    HISTORY_INVALID_VISIBILITY("HISTORY400", "공개 여부 ENUM이 적절하지 않습니다.", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
