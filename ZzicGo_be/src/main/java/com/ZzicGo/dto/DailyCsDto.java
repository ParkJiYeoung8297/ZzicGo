package com.ZzicGo.dto;

import com.ZzicGo.domain.cs.*;
import java.time.*;
import java.util.List;

public final class DailyCsDto {
    private DailyCsDto() {}
    public record QuestionWrite(String question, String answer, LocalDateTime publishedAt, boolean published) {}
    public record DayWrite(LocalDate date, LocalDateTime scheduledAt, boolean generationCompleted, List<QuestionWrite> questions) {}
    public record CompletionWrite(boolean generationCompleted) {}
    public record QuestionView(Long id, String question, String answer, LocalDateTime createdAt,
                               LocalDateTime updatedAt, LocalDateTime publishedAt, boolean published) {
        public static QuestionView from(DailyCsQuestion q) {
            return new QuestionView(q.getId(), q.getQuestion(), q.getAnswer(), q.getCreatedAt(),
                    q.getUpdatedAt(), q.getPublishedAt(), q.isPublished());
        }
    }
    public record DayView(Long id, LocalDate date, boolean generationCompleted, long heartCount,
                          LocalDateTime createdAt, LocalDateTime scheduledAt, String introduction, String review, List<QuestionView> questions) {
        public static DayView from(DailyCsDay day, List<QuestionView> questions) {
            return new DayView(day.getId(), day.getDate(), day.isGenerationCompleted(), day.getHeartCount(),
                    day.getCreatedAt(), day.getScheduledAt(), day.getIntroduction(), day.getReview(), questions);
        }
    }
}
