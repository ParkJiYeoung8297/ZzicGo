package com.ZzicGo.repository;

import com.ZzicGo.domain.challenge.Challenge;
import com.ZzicGo.domain.challenge.ChallengeParticipation;
import com.ZzicGo.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChallengeParticipationRepository extends JpaRepository<ChallengeParticipation, Long> {
    Optional<ChallengeParticipation> findByUserAndChallenge(User user, Challenge challenge);
}
