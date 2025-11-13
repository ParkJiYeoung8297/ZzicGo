package com.ZzicGo.domain.terms;

import com.ZzicGo.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "terms")
public class Terms extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 서비스 이용약관, 개인정보처리방침, 마케팅 등
    @Enumerated(EnumType.STRING)
    @Column(name = "term_type", nullable = false, length = 30)
    private TermType termType;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // 버전 (e.g. v1.0, v2.0)
    @Column(length = 20)
    private String version;

    // 필수 여부
    @Column(name = "is_required", nullable = false)
    private boolean isRequired;

    // 약관 시행일
    @Column(name = "effective_date")
    private LocalDateTime effectiveDate;

}

