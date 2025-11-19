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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;
    private final ChallengeParticipationRepository challengeParticipationRepository;

    public List<ChallengeResponseDto.Challenge> getAllActiveChallenges() {
        List<Challenge> list = challengeRepository.findAllByStatus(ChallengeStatus.ACTIVATE);
        return list.stream()
                .map( c-> new ChallengeResponseDto.Challenge(
                        c.getId(),
                        c.getName(),
                        c.getDescription()
                ))
                .toList();
    }

    public List<ChallengeResponseDto.MyChallenge> getMyActiveChallenges(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(UserException.NOT_EXIST_USER));

        List<ChallengeParticipation> myChallenges = challengeParticipationRepository
                .findAllByUserAndStatus(user, ParticipationStatus.JOINED);

        return myChallenges.stream()
                .map(cp -> new ChallengeResponseDto.MyChallenge(
                        cp.getId(),
                        cp.getChallenge().getId(),
                        cp.getChallenge().getName()
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

    public String leaveChallenge(Long participationId, Long userId) {
        ChallengeParticipation cp = challengeParticipationRepository.findById(participationId)
                .orElseThrow(() -> new CustomException(ChallenegeException.PARTICIPATION_NOT_FOUND));

        if (!cp.getUser().getId().equals(userId)) {
            throw new CustomException(UserException.NO_PERMISSION);
        }

        if (cp.getStatus() == ParticipationStatus.LEFT) {
            throw new CustomException(ChallenegeException.PARTICIPATION_ALREADY_LEFT);
        }
        cp.leave();

        return "챌린지 탈퇴 성공";
    }

    public ChallengeResponseDto.ParticipationCheck checkParticipation(Long challengeId, Long loginUserId) {

        // 🔥 챌린지 존재 여부 검증
        boolean exists = challengeRepository.existsById(challengeId);
        if (!exists) {
            throw new CustomException(ChallenegeException.CHALLENGE_NOT_FOUND);
        }

        // 🔥 로그인 유저 조회
        User user = userRepository.findById(loginUserId)
                .orElseThrow(() -> new CustomException(UserException.NOT_EXIST_USER));

        // 🔥 참여 여부 조회
        Optional<ChallengeParticipation> participationOpt =
                challengeParticipationRepository.findByUserAndChallenge(user, Challenge.builder().id(challengeId).build());

        // 참여 기록 없음
        if (participationOpt.isEmpty()) {
            return new ChallengeResponseDto.ParticipationCheck(false, null);
        }

        // 참여했으나 탈퇴했는지 체크
        ChallengeParticipation participation = participationOpt.get();
        boolean isJoined = participation.getStatus().isJOINED();

        if (isJoined) {
            return new ChallengeResponseDto.ParticipationCheck(true, participation.getId());
        } else {
            return new ChallengeResponseDto.ParticipationCheck(false, null);
        }
    }
}