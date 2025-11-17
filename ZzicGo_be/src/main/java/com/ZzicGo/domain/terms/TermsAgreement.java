package com.ZzicGo.domain.terms;

import com.ZzicGo.domain.common.BaseEntity;
import com.ZzicGo.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "terms_agreement",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_term",
                        columnNames = {"user_id", "term_id"}
                )
        }
)
public class TermsAgreement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "term_id", nullable = false)
    private Terms terms;

    @Column(name = "is_agreed", nullable = false)
    private boolean isAgreed;

    @Column(name = "agreed_at", nullable = false)
    private LocalDateTime agreedAt;

    public void agree() {
        this.isAgreed = true;
    }

    public void revoke() {
        this.isAgreed = false;
    }

    public void updateAgreement(boolean isAgreed) {
        // 기존 isAgreed = false 이고 요청이 true일 때만 업데이트
        if (!this.isAgreed && isAgreed) {
            this.isAgreed = true;
        }
        // NOTE: false로 바꾸는 건 허용하지 않음
    }
}

