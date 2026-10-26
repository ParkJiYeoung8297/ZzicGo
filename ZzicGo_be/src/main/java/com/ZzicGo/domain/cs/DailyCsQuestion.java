package com.ZzicGo.domain.cs;

import com.ZzicGo.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_cs_questions", indexes = @Index(name = "idx_daily_cs_question_day", columnList = "day_id"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyCsQuestion extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "day_id", nullable = false)
    private DailyCsDay day;
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String question;
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String answer;
    @Column(nullable = false)
    private LocalDateTime publishedAt;
    @Column(nullable = false)
    private boolean published;

    public DailyCsQuestion(DailyCsDay day, String question, String answer, LocalDateTime publishedAt, boolean published) {
        this.day = day;
        update(question, answer, publishedAt, published);
    }
    public void update(String question, String answer, LocalDateTime publishedAt, boolean published) {
        this.question = question;
        this.answer = answer;
        this.publishedAt = publishedAt;
        this.published = published;
    }
    public boolean isVisibleAt(LocalDateTime now) {
        return day.isVisibleAt(now) && published && !publishedAt.isAfter(now);
    }
}
