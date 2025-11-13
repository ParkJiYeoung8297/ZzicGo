package com.ZzicGo.domain.challenge;

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
        name = "challenge_participation",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_challenge",
                        columnNames = {"user_id", "challenge_id"}
                )
        }
)
public class ChallengeParticipation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK : challenge_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    // FK : user_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipationStatus status; // activate, deactivate

    public void leave() {
        this.status = ParticipationStatus.LEFT;
    }

    public void reJoin() {
        this.status = ParticipationStatus.JOINED;
    }
}

