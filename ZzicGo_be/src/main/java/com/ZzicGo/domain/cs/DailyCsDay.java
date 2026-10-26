package com.ZzicGo.domain.cs;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name = "daily_cs_days", uniqueConstraints = @UniqueConstraint(name = "uk_daily_cs_date", columnNames = "study_date"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyCsDay {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "study_date", nullable = false)
    private LocalDate date;
    @Column(nullable = false)
    private boolean generationCompleted;
    @Column(nullable = false)
    private long heartCount;
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    @Column(columnDefinition = "LONGTEXT")
    private String introduction;
    @Column(columnDefinition = "LONGTEXT")
    private String review;

    public DailyCsDay(LocalDate date, LocalDateTime scheduledAt, boolean generationCompleted) {
        this.date = date;
        this.scheduledAt = scheduledAt;
        this.generationCompleted = generationCompleted;
        this.createdAt = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
    }
    public void setGenerationCompleted(boolean completed) { this.generationCompleted = completed; }
    public boolean isVisibleAt(LocalDateTime now) {
        return generationCompleted && !scheduledAt.isAfter(now);
    }
}
