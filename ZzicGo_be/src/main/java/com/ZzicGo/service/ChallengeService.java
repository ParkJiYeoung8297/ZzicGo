package com.ZzicGo.service;

import com.ZzicGo.domain.challenge.Challenge;
import com.ZzicGo.domain.challenge.ChallengeParticipation;
import com.ZzicGo.domain.challenge.ChallengeStatus;
import com.ZzicGo.domain.challenge.ParticipationStatus;
import com.ZzicGo.domain.user.User;
import com.ZzicGo.dto.ChallengeResponseDto;
import com.ZzicGo.exception.ChallenegeException;
import com.ZzicGo.exception.UserException;
import com.ZzicGo.global.CustomException;
import com.ZzicGo.repository.ChallengeParticipationRepository;
import com.ZzicGo.repository.ChallengeRepository;
import com.ZzicGo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;
    private final ChallengeParticipationRepository challengeParticipationRepository;

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

    public String joinChallenge(Long challengeId, Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(UserException.NOT_EXIST_USER));

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new CustomException(ChallenegeException.CHALLENGE_NOT_FOUND));

        // 이미 참여한건지 확인
        Optional<ChallengeParticipation> existingParticipation =
                challengeParticipationRepository.findByUserAndChallenge(user, challenge);

        if (existingParticipation.isPresent()) {
            ChallengeParticipation cp = existingParticipation.get();

            // 이미 참여한 상태라면 에러
            if (cp.getStatus() == ParticipationStatus.JOINED) {
                throw new CustomException(ChallenegeException.PARTICIPATION_ALREADY_JOINED);
            }

            cp.reJoin();
            return "챌린지 다시 참여 성공";
        }

        // 처음 참여
        ChallengeParticipation newParticipation = ChallengeParticipation.builder()
                .user(user)
                .challenge(challenge)
                .status(ParticipationStatus.JOINED)
                .build();

        challengeParticipationRepository.save(newParticipation);
        return "챌린지 참여 성공";

    }
}
