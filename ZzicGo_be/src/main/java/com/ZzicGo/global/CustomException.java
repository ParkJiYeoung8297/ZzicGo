package com.ZzicGo.global;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException{

    private final BaseCode code;

    public CustomException(BaseCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode;
    }
}
