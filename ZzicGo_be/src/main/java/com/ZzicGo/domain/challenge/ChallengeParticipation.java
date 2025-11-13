package com.ZzicGo.domain.challenge;

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
        name = "challenge_participation",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_challenge",
                        columnNames = {"user_id", "challenge_id"}
                )
        }
)
public class ChallengeParticipation {

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

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public void leave() {
        this.status = ParticipationStatus.LEFT;
        this.updatedAt = LocalDateTime.now();
    }

    public void reJoin() {
        this.status = ParticipationStatus.JOINED;
        this.updatedAt = LocalDateTime.now();
    }
}

