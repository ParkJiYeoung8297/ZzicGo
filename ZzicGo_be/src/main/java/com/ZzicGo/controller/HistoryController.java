package com.ZzicGo.controller;

import com.ZzicGo.config.jwt.CustomUserDetails;
import com.ZzicGo.dto.HistoryRequestDto;
import com.ZzicGo.dto.HistoryResponseDto;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.service.HistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "History",description = "챌린지 인증글 기록")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/z1/history")
public class HistoryController {

    private final HistoryService historyService;

    @Operation(
            summary = "인증 게시글 업로드 API By 박지영",
            description = "인증 게시글을 DB에 저장합니다. (하루 인증 게시글 1개, 게시글 내에 사진 최대 3개)"
    )
    @PostMapping("/{participationId}")
    public CustomResponse<HistoryResponseDto.CreateHistoryResponse> createHistory(
            @Parameter(description = "챌린지 참여 ID", example = "1")
            @PathVariable Long participationId,
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody HistoryRequestDto.CreateHistoryRequest request
    ) {
        Long userId = user.getUserId();

        Long historyId = historyService.createHistory(participationId, request, userId);
        return CustomResponse.ok(
                new HistoryResponseDto.CreateHistoryResponse(
                        historyId,
                        "인증글이 성공적으로 등록되었습니다."
                )
        );
    }
}

