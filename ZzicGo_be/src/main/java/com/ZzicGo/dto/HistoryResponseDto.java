package com.ZzicGo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;


public class HistoryResponseDto {

    @Getter
    @AllArgsConstructor
    public static class CreateHistoryResponse {
        private Long historyId;
        private String message;
    }

}
