package com.ZzicGo.exception;

import com.ZzicGo.global.BaseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ChallenegeException implements BaseCode {

    // 챌린지 관련
    CHALLENGE_NOT_FOUND("CHALLENGE404", "존재하지 않는 챌린지입니다.", HttpStatus.NOT_FOUND),
    CHALLENGE_INACTIVE("CHALLENGE400", "현재 비활성화된 챌린지입니다.", HttpStatus.BAD_REQUEST),

    // 참여 관련
    PARTICIPATION_NOT_FOUND("PARTICIPATION404", "유저의 챌린지 참여 정보가 없습니다.", HttpStatus.NOT_FOUND),
    PARTICIPATION_FORBIDDEN("PARTICIPATION403", "본인의 참여가 아니므로 접근할 수 없습니다.", HttpStatus.FORBIDDEN),

    // 인증글 관련
    HISTORY_ALREADY_TODAY("HISTORY409", "오늘은 이미 인증글을 작성했습니다.", HttpStatus.CONFLICT),
    HISTORY_IMAGE_LIMIT("HISTORY400", "사진은 최대 3장까지만 업로드할 수 있습니다.", HttpStatus.BAD_REQUEST),
    HISTORY_CONTENT_EMPTY("HISTORY400", "인증글 내용은 빈값일 수 없습니다.", HttpStatus.BAD_REQUEST);


    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
