package com.ZzicGo.controller;

import com.ZzicGo.config.jwt.CustomUserDetails;
import com.ZzicGo.domain.history.Visibility;
import com.ZzicGo.dto.HistoryResponseDto;
import com.ZzicGo.dto.oauth.AuthResponseDto;
import com.ZzicGo.exception.HistoryException;
import com.ZzicGo.global.CustomException;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.global.s3.S3Uploader;
import com.ZzicGo.service.HistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "History", description = "챌린지 인증글 기록")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/z1/history")
public class HistoryController {

    private final HistoryService historyService;
    private final S3Uploader s3Uploader;
    
    @Operation(
            summary = "인증 기록 업로드 API",
            description = "인증 기록을 DB에 저장합니다. (하루 인증 게시글 1개, 게시글 내에 사진 최대 3개)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "COMMON200", description = "인증 기록 성공",
                    content = @Content(schema = @Schema(implementation = AuthResponseDto.LoginResponse.class))),
            @ApiResponse(responseCode = "PARTICIPATION404", description = "유저의 챌린지 참여 정보가 없습니다.", content = @Content),
            @ApiResponse(responseCode = "PARTICIPATION403", description = "본인의 참여가 아니므로 접근할 수 없습니다.", content = @Content),
            @ApiResponse(responseCode = "HISTORY409", description = "오늘은 이미 인증글을 작성했습니다.", content = @Content),
            @ApiResponse(responseCode = "HISTORY400", description = "사진은 최대 3장까지만 업로드할 수 있습니다.", content = @Content),
    })
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
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long historyId
    ) {
        historyService.deleteHistory(historyId, userDetails.getUserId());
        return CustomResponse.ok("히스토리 삭제 완료");
    }

    @Operation(summary = "오늘 인증 여부 확인", description = "오늘 이 챌린지에서 인증한 기록이 있는지 확인합니다.")
    @GetMapping("/participations/{participationId}/today")
    public CustomResponse<HistoryResponseDto.TodayHistory> checkToday(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long participationId
    ) {
        HistoryResponseDto.TodayHistory response = historyService.checkTodayHistory(participationId, userDetails.getUserId());
        return CustomResponse.ok(response);
    }

    @Operation(
            summary = "인증 기록 수정 API",
            description = "기존 인증 기록의 내용, 공개 범위, 이미지를 수정합니다."
    )
    @PatchMapping(value = "/{historyId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CustomResponse<HistoryResponseDto.UpdateHistoryResponse> updateHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long historyId,

            @RequestPart(value = "images", required = false) List<MultipartFile> newImages,
            @RequestPart(value = "deleteImageIds", required = false) List<Long> deleteImageIds,
            @RequestPart(value = "content", required = false) String content,
            @RequestPart(value = "visibility", required = false) String visibilityStr
    ) {
        Long userId = userDetails.getUserId();
        Visibility visibility = Visibility.of(visibilityStr);
        historyService.updateHistory(userId, historyId, newImages, deleteImageIds, content, visibility);

        return CustomResponse.ok(
                HistoryResponseDto.UpdateHistoryResponse.builder()
                        .historyId(historyId)
                        .message("인증글이 성공적으로 수정되었습니다.")
                        .build()
        );
    }

    @Operation(
            summary = "인증 기록 조회 API",
            description = "선택한 인증 기록을 조회합니다."
    )
    @GetMapping(value = "/{historyId}")
    public CustomResponse<HistoryResponseDto.GetHistoryResponse> getHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long historyId
    ) {
        Long userId = userDetails.getUserId();
        HistoryResponseDto.GetHistoryResponse response = historyService.getHistory(userId, historyId);
        return CustomResponse.ok(response);
    }



}

