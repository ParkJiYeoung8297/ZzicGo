package com.ZzicGo.service;

import com.ZzicGo.domain.challenge.ChallengeParticipation;
import com.ZzicGo.domain.history.History;
import com.ZzicGo.domain.history.ImageUrl;
import com.ZzicGo.domain.history.Visibility;
import com.ZzicGo.dto.HistoryRequestDto;
import com.ZzicGo.exception.ChallenegeException;
import com.ZzicGo.exception.HistoryException;
import com.ZzicGo.global.CustomException;
import com.ZzicGo.global.s3.S3Uploader;
import com.ZzicGo.repository.ChallengeParticipationRepository;
import com.ZzicGo.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HistoryService {

    private final ChallengeParticipationRepository participationRepository;
    private final HistoryRepository historyRepository;
    private final S3Uploader s3Uploader;

    public Long createHistory(Long participationId, Long loginUserId, List<MultipartFile> images, String content, Visibility visibility) {

        ChallengeParticipation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new CustomException(ChallenegeException.PARTICIPATION_NOT_FOUND));

        // 🔥 참여 주인인지 검증
        if (!participation.getUser().getId().equals(loginUserId)) {
            throw new CustomException(ChallenegeException.PARTICIPATION_FORBIDDEN);
        }

        // 🔥 챌린지가 활성 상태인지 검증
        if (!participation.getChallenge().getStatus().isActive()) {
            throw new CustomException(ChallenegeException.CHALLENGE_INACTIVE);
        }

        // 🔥 챌린지 참여 상태 검증 (참여 중이 아닐 시 인증 불가)
        if (!participation.getStatus().isJOINED()) {
            throw new CustomException(ChallenegeException.PARTICIPATION_ALREADY_LEFT);
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

        if (images == null || images.isEmpty()) {
            throw new CustomException(HistoryException.HISTORY_IMAGE_NOT_NULL);
        }

        // 🔥 사진 개수 검증 (max 3)
        if (images != null && images.size() > 3) {
            throw new CustomException(HistoryException.HISTORY_IMAGE_LIMIT);
        }

        // 📌 S3 업로드
        List<String> uploadedUrls = new ArrayList<>();

        for (MultipartFile img : images) {
            String url = s3Uploader.uploadFile("history", img);
            uploadedUrls.add(url);
        }

        // 📌 History 생성
        History history = History.builder()
                .participation(participation)
                .visibility(visibility)
                .content(content)
                .build();

        // 📌 이미지 저장
        for (int i = 0; i < uploadedUrls.size(); i++) {
            ImageUrl image = ImageUrl.builder()
                    .imageUrl(uploadedUrls.get(i))
                    .orderNumber(i)
                    .build();
            history.addImage(image);
        }
        History saved = historyRepository.save(history);
        return saved.getId();
    }
}
