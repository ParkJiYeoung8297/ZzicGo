package com.ZzicGo.controller;

import com.ZzicGo.config.jwt.CustomUserDetails;
import com.ZzicGo.domain.history.Visibility;
import com.ZzicGo.dto.HistoryResponseDto;
import com.ZzicGo.exception.HistoryException;
import com.ZzicGo.global.CustomException;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.global.s3.S3Uploader;
import com.ZzicGo.service.HistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "History",description = "챌린지 인증글 기록")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/z1/history")
public class HistoryController{

    private final HistoryService historyService;
    private final S3Uploader s3Uploader;
    
    @Operation(
            summary = "인증 기록 업로드 API",
            description = "인증 기록을 DB에 저장합니다. (하루 인증 게시글 1개, 게시글 내에 사진 최대 3개)"
    )
    @PostMapping(value = "/{participationId}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CustomResponse<HistoryResponseDto.CreateHistoryResponse> createHistory(
            @Parameter(description = "챌린지 참여 ID", example = "1")
            @PathVariable Long participationId,
            @AuthenticationPrincipal CustomUserDetails user,

            @RequestPart(value = "images", required=false) List<MultipartFile> images,
            @RequestPart(value = "content", required=false) String content,
            @RequestPart(value = "visibility", required=false) String visibilityStr
    ) {
        Long userId = user.getUserId();
        Visibility visibility;
        try {
            visibility = Visibility.valueOf(visibilityStr);
        } catch (IllegalArgumentException e) {
            throw new CustomException(HistoryException.HISTORY_INVALID_VISIBILITY);
        }

        Long historyId = historyService.createHistory(participationId, userId, images, content, visibility);
        return CustomResponse.ok(
                new HistoryResponseDto.CreateHistoryResponse(
                        historyId,
                        "인증글이 성공적으로 등록되었습니다."
                )
        );
    }

    @Operation(summary = "인증 기록 삭제 API", description = "나의 인증 기록을 삭제합니다.")
    @DeleteMapping("/{historyId}")
    public CustomResponse<String> deleteHistory(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long historyId
    ) {
        historyService.deleteHistory(historyId, user.getUserId());
        return CustomResponse.ok("히스토리 삭제 완료");
    }

    @Operation(summary = "오늘 인증 여부 확인", description = "오늘 이 챌린지에서 인증한 기록이 있는지 확인합니다.")
    @GetMapping("/participations/{participationId}/today")
    public CustomResponse<HistoryResponseDto.TodayHistory> checkToday(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long participationId
    ) {
        HistoryResponseDto.TodayHistory response  = historyService.checkTodayHistory(participationId, user.getUserId());
        return CustomResponse.ok(response);
    }


}

