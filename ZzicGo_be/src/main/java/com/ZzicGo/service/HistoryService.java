package com.ZzicGo.service;

import com.ZzicGo.domain.challenge.ChallengeParticipation;
import com.ZzicGo.domain.history.History;
import com.ZzicGo.domain.history.ImageUrl;
import com.ZzicGo.dto.HistoryRequestDto;
import com.ZzicGo.exception.ChallenegeException;
import com.ZzicGo.exception.HistoryException;
import com.ZzicGo.global.CustomException;
import com.ZzicGo.repository.ChallengeParticipationRepository;
import com.ZzicGo.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HistoryService {

    private final ChallengeParticipationRepository participationRepository;
    private final HistoryRepository historyRepository;

    public Long createHistory(Long participationId, HistoryRequestDto.CreateHistoryRequest request, Long loginUserId) {

        ChallengeParticipation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new CustomException(ChallenegeException.CHALLENGE_NOT_FOUND));

        // 🔥 참여 주인인지 검증
        if (!participation.getUser().getId().equals(loginUserId)) {
            throw new CustomException(ChallenegeException.PARTICIPATION_FORBIDDEN);
        }

        // 🔥 오늘 이미 인증한 기록이 있는지 확인
        LocalDate today = LocalDate.now();
        boolean existsToday = historyRepository.existsByParticipationAndCreatedAtBetween(
                participation,
                today.atStartOfDay(),
                today.plusDays(1).atStartOfDay()
        );

        if (existsToday) {
            throw new CustomException(HistoryException.HISTORY_ALREADY_TODAY);
        }

        // 🔥 사진 개수 검증 (max 3)
        List<String> urls = request.getImageUrls();
        if (urls != null && urls.size() > 3) {
            throw new CustomException(HistoryException.HISTORY_IMAGE_LIMIT);
        }

        // 📌 History 생성
        History history = History.builder()
                .participation(participation)
                .visibility(request.getVisibility())
                .content(request.getContent())
                .build();

        // 📌 이미지 저장
        if (urls != null) {
            for (int i = 0; i < urls.size(); i++) {
                ImageUrl image = ImageUrl.builder()
                        .imageUrl(urls.get(i))
                        .orderNumber(i)
                        .build();
                history.addImage(image);
            }
        }

        History saved = historyRepository.save(history);
        return saved.getId();
    }
}
