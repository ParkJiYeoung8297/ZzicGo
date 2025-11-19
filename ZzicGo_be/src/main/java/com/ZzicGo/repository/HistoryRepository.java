package com.ZzicGo.repository;

import com.ZzicGo.domain.challenge.ChallengeParticipation;
import com.ZzicGo.domain.history.History;
import com.ZzicGo.domain.history.Visibility;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface HistoryRepository extends JpaRepository<History,Long> {
    boolean existsByParticipationAndCreatedAtBetween(ChallengeParticipation participation, LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);

    @Query("""
        SELECT h FROM History h
        JOIN h.participation p
        JOIN p.challenge c
        WHERE c.id = :challengeId
        AND h.visibility = com.ZzicGo.domain.history.Visibility.PUBLIC
        AND (
            :cursorCreatedAt IS NULL OR h.createdAt < :cursorCreatedAt 
            OR (h.createdAt = :cursorCreatedAt AND h.id < :cursorId)
        )
        ORDER BY h.createdAt DESC, h.id DESC
    """)

    List<History> findPublicHistoryByCursor(
            @Param("challengeId") Long challengeId,
            @Param("cursorCreatedAt") LocalDateTime cursorCreatedAt,
            @Param("cursorId") Long cursorId,
            Pageable pageable
    );

    @Query("""
        SELECT h FROM History h
        JOIN h.participation p
        JOIN p.challenge c
        WHERE c.id = :challengeId
        AND p.user.id = :loginUserId
        AND (
            :cursorCreatedAt IS NULL OR h.createdAt < :cursorCreatedAt 
            OR (h.createdAt = :cursorCreatedAt AND h.id < :cursorId)
        )
        ORDER BY h.createdAt DESC, h.id DESC
    """)
    List<History> findMyAllHistoryByCursor(
            @Param("loginUserId") Long loginUserId,
            @Param("challengeId") Long challengeId,
            @Param("cursorCreatedAt") LocalDateTime cursorCreatedAt,
            @Param("cursorId") Long cursorId,
            Pageable pageable
    );
}
