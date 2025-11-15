package com.ZzicGo.repository;

import com.ZzicGo.domain.challenge.Challenge;
import com.ZzicGo.domain.challenge.ChallengeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findAllByStatus(ChallengeStatus status);
}
