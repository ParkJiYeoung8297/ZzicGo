package com.ZzicGo.service;

import com.ZzicGo.domain.challenge.Challenge;
import com.ZzicGo.domain.challenge.ChallengeParticipation;
import com.ZzicGo.domain.challenge.ParticipationStatus;
import com.ZzicGo.domain.history.History;
import com.ZzicGo.domain.history.ImageUrl;
import com.ZzicGo.domain.history.Visibility;
import com.ZzicGo.domain.user.User;
import com.ZzicGo.dto.HistoryResponseDto;
import com.ZzicGo.exception.ChallenegeException;
import com.ZzicGo.exception.HistoryException;
import com.ZzicGo.exception.UserException;
import com.ZzicGo.global.CustomException;
import com.ZzicGo.global.s3.S3Uploader;
import com.ZzicGo.repository.*;
import com.ZzicGo.util.Cursor;
import com.ZzicGo.util.CursorEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HistoryService {

    private final ChallengeParticipationRepository participationRepository;
    private final HistoryRepository historyRepository;
    private final S3Uploader s3Uploader;
    private final ChallengeRepository challengeRepository;
    private final CursorEncoder cursorEncoder;
    private final ImageUrlRepository imageUrlRepository;
    private final UserRepository userRepository;

    public Long createHistory(Long participationId, Long loginUserId, List<MultipartFile> images, String content, Visibility visibility) {

        ChallengeParticipation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new CustomException(ChallenegeException.PARTICIPATION_NOT_FOUND));

        // 🔥 참여 주인인지 검증
        if (!participation.getUser().getId().equals(loginUserId)) {
            throw new CustomException(ChallenegeException.PARTICIPATION_FORBIDDEN);
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
            String key = s3Uploader.uploadFile("history", img);
            uploadedUrls.add(key);
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


    @Transactional(readOnly = true)
    public HistoryResponseDto.CursorResponse getHistories(Long loginUserId, Long challengeId, Visibility visibility, String cursor, int size) {

        // 🔥 챌린지가 존재하는지 검증
        boolean exists = challengeRepository.existsById(challengeId);
        if (!exists) {
            throw new CustomException(ChallenegeException.CHALLENGE_NOT_FOUND);
        }

        // 🔥 유저 조회
        User user = userRepository.findById(loginUserId)
                .orElseThrow(() -> new CustomException(UserException.NOT_EXIST_USER));

        // 🔥 참여 엔티티 조회 (참여자인지 검증)
        ChallengeParticipation participation = participationRepository
                .findByUserAndChallenge(user, Challenge.builder().id(challengeId).build())
                .orElseThrow(() -> new CustomException(ChallenegeException.PARTICIPATION_FORBIDDEN));

        // 🔥 참여 상태가 JOINED인지 검증
        if (!participation.getStatus().isJOINED()) {
            throw new CustomException(ChallenegeException.PARTICIPATION_ALREADY_LEFT);
        }
        
        Cursor decoded = cursorEncoder.decode(cursor);
        Pageable pageable = PageRequest.of(0, size);

        // 🔥 히스토리 조회
        List<History> histories;
        // ⭐ visibility = PRIVATE → 내 히스토리 전체 조회
        if (visibility == Visibility.PRIVATE) {
            histories = historyRepository.findMyAllHistoryByCursor(
                    loginUserId,
                    challengeId,
                    decoded == null ? null : decoded.getCreatedAt(),
                    decoded == null ? null : decoded.getId(),
                    pageable
            );
        }
        // ⭐ visibility = PUBLIC → 전체 참여자의 PUBLIC만 조회
        else if (visibility == Visibility.PUBLIC) {
            histories = historyRepository.findPublicHistoryByCursor(
                    challengeId,
                    decoded == null ? null : decoded.getCreatedAt(),
                    decoded == null ? null : decoded.getId(),
                    pageable
            );
        }
        else {
            throw new CustomException(HistoryException.HISTORY_INVALID_VISIBILITY);
        }

        List<Long> ids = histories.stream().map(History::getId).toList();

        List<ImageUrl> images = ids.isEmpty()
                ? List.of()
                : imageUrlRepository.findByHistoryIds(ids);

        Map<Long, List<String>> imageMap = images.stream()
                .collect(Collectors.groupingBy(
                        img -> img.getHistory().getId(),
                        Collectors.mapping(
                                img -> s3Uploader.getPresignedUrl(img.getImageUrl()),
                                Collectors.toList()
                        )
                ));

        List<HistoryResponseDto.HistoryItem> items = histories.stream()
                .map(h -> HistoryResponseDto.HistoryItem.builder()
                        .historyId(h.getId())
                        .userId(h.getParticipation().getUser().getId())
                        .name(h.getParticipation().getUser().getNickname())
                        .profileImageUrl(h.getParticipation().getUser().getProfileImageUrl())
                        .content(h.getContent())
                        .images(imageMap.getOrDefault(h.getId(), List.of()))
                        .createdAt(h.getCreatedAt())
                        .build())
                .toList();
        // next cursor
        String nextCursor = null;
        boolean hasMore = false;

        if (!histories.isEmpty()) {
            History last = histories.get(histories.size() - 1);
            nextCursor = cursorEncoder.encode(last.getCreatedAt(), last.getId());
            hasMore = true;
        }
        return new HistoryResponseDto.CursorResponse(items, nextCursor, hasMore);
    }


    @Transactional
    public void deleteHistory(Long historyId, Long loginUserId) {

        // 1) 히스토리 조회
        History history = historyRepository.findById(historyId)
                .orElseThrow(() -> new CustomException(HistoryException.HISTORY_NOT_FOUND));

        // 2) 주인 검증
        Long ownerId = history.getParticipation().getUser().getId();
        if (!ownerId.equals(loginUserId)) {
            throw new CustomException(ChallenegeException.PARTICIPATION_FORBIDDEN);
        }

        // 3) 이미지 목록 조회
        List<ImageUrl> images = imageUrlRepository.findByHistoryIds(List.of(historyId));

        // 4) S3 파일 삭제
        for (ImageUrl img : images) {
            s3Uploader.deleteFile(img.getImageUrl());
        }

        // 5) image_url 테이블 삭제
        imageUrlRepository.deleteAll(images);

        // 6) history 삭제
        historyRepository.delete(history);
    }

    @Transactional(readOnly = true)
    public HistoryResponseDto.TodayHistory checkTodayHistory(Long participationId, Long loginUserId) {

        // 참여 정보 찾기
        ChallengeParticipation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new CustomException(ChallenegeException.PARTICIPATION_NOT_FOUND));

        // 권한 체크 (내가 참여자?)
        if (!participation.getUser().getId().equals(loginUserId)) {
            throw new CustomException(ChallenegeException.PARTICIPATION_FORBIDDEN);
        }

        // 오늘 날짜 범위
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        // 오늘 기록 있는지 여부
        Optional<History> historyOpt = historyRepository
                .findByParticipationAndCreatedAtBetween(participation, start, end);

        // 🔥 존재하면 checked=true + historyId 포함
        return historyOpt
                .map(history -> HistoryResponseDto.TodayHistory.builder()
                        .checked(true)
                        .historyId(history.getId())
                        .build())
                // 🔥 없으면 checked=false + null
                .orElseGet(() -> HistoryResponseDto.TodayHistory.builder()
                        .checked(false)
                        .historyId(null)
                        .build());
    }


}
