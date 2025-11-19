package com.ZzicGo.repository;

import com.ZzicGo.domain.challenge.ChallengeParticipation;
import com.ZzicGo.domain.history.History;
import com.ZzicGo.domain.history.Visibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface HistoryRepository extends JpaRepository<History,Long> {
    boolean existsByParticipationAndCreatedAtBetween(ChallengeParticipation participation, LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);

    @Query("""
        SELECT h FROM History h
        JOIN FETCH h.participation p
        JOIN FETCH p.challenge c
        LEFT JOIN FETCH h.images i
        WHERE c.id = :challengeId
        AND h.visibility = :visibility
        ORDER BY h.createdAt DESC
    """)
    List<History> findByChallengeAndVisibility(
            @Param("challengeId") Long challengeId,
            @Param("visibility") Visibility visibility
    );
}
