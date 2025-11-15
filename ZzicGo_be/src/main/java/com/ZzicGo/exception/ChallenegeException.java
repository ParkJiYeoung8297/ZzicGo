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
    PARTICIPATION_ALREADY_JOINED("PARTICIPATION400", "이미 참여 중인 챌린지입니다.",HttpStatus.BAD_REQUEST),
    PARTICIPATION_ALREADY_LEFT("CHALLENGE400", "이미 탈퇴한 챌린지입니다.", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}