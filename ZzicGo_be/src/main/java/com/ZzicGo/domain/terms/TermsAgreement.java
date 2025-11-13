package com.ZzicGo.domain.terms;

import com.ZzicGo.domain.common.BaseEntity;
import com.ZzicGo.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

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

    // 유저
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 동의한 약관 (버전에 대한 FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "term_id", nullable = false)
    private Terms terms;

    // true = 동의 / false = 비동의 or 철회
    @Column(name = "is_agreed", nullable = false)
    private boolean isAgreed;

    // === 로직 ===
    public void agree() {
        this.isAgreed = true;
    }

    public void revoke() {
        this.isAgreed = false;
    }
}

