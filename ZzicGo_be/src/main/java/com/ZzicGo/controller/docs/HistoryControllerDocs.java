package com.ZzicGo.controller.docs;

import com.ZzicGo.config.jwt.CustomUserDetails;
import com.ZzicGo.dto.oauth.AuthResponseDto;
import com.ZzicGo.dto.HistoryResponseDto;
import com.ZzicGo.global.CustomResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface HistoryControllerDocs {

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
    );
}
