package com.ZzicGo.service;

import com.ZzicGo.domain.challenge.Challenge;
import com.ZzicGo.domain.challenge.ChallengeStatus;
import com.ZzicGo.dto.ChallengeResponseDto;
import com.ZzicGo.repository.ChallengeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;

    public List<ChallengeResponseDto.Challenges> getAllActiveChallenges() {
        List<Challenge> list = challengeRepository.findAllByStatus(ChallengeStatus.ACTIVATE);
        return list.stream()
                .map( c-> new ChallengeResponseDto.Challenges(
                        c.getId(),
                        c.getName(),
                        c.getDescription()
                ))
                .toList();
    }
}
