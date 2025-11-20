package com.ZzicGo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
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
        private Long userId;
        private String name;
        private String profileImageUrl;
        private String content;
        private List<String> images; // presigned URL 목록
        private LocalDateTime createdAt;
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

    @Getter
    @AllArgsConstructor
    @Builder
    public static class TodayHistory {
        private final boolean checked;
        private final Long historyId;
    }

}
