package com.ZzicGo.repository;

import com.ZzicGo.domain.challenge.ChallengeParticipation;
import com.ZzicGo.domain.history.History;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface HistoryRepository extends JpaRepository<History,Long> {
    boolean existsByParticipationAndCreatedAtBetween(ChallengeParticipation participation, LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);
}
