package com.ZzicGo.domain.interview;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "interview_questions", indexes = {
        @Index(name = "idx_interview_question_order", columnList = "sort_order")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class InterviewQuestion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
