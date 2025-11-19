package com.ZzicGo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;


public class HistoryResponseDto {

    @Getter
    @AllArgsConstructor
    public static class CreateHistoryResponse {
        private Long historyId;
        private String message;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class HistoryItem {
        private Long historyId;
        private String content;
        private String visibility;
        private List<String> images; // presigned URL 목록
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class HistoryListResponse {
        private List<HistoryItem> histories;
    }

    @Getter
    @AllArgsConstructor
    public static class CursorResponse {
        private List<HistoryItem> histories;
        private String nextCursor;
        private boolean hasMore;
    }

}
