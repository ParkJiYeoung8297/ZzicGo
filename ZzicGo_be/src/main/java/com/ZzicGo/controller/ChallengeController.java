package com.ZzicGo.controller;

import com.ZzicGo.config.jwt.CustomUserDetails;
import com.ZzicGo.domain.history.Visibility;
import com.ZzicGo.dto.AuthResponseDto;
import com.ZzicGo.dto.ChallengeResponseDto;
import com.ZzicGo.dto.HistoryResponseDto;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.service.ChallengeService;
import com.ZzicGo.service.HistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Challenges", description = "챌린지")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/z1/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;
    private final HistoryService historyService;

    @Operation(
            summary = "전체 챌린지 목록 조회",
            description = "활성화된 챌린지들의 이름과 설명을 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "COMMON200", description = "챌린지 목록 조회 성공",
                    content = @Content(schema = @Schema(implementation = AuthResponseDto.LoginResponse.class))),
            @ApiResponse(responseCode = "USER_404", description = "존재하지 않는 사용자입니다.", content = @Content),
            @ApiResponse(responseCode = "CHALLENGE404", description = "존재하지 않는 챌린지입니다.", content = @Content),
    })
    @GetMapping("/")
    public CustomResponse<List<ChallengeResponseDto.Challenge>> getChallenges(){
        List<ChallengeResponseDto.Challenge> result = challengeService.getAllActiveChallenges();
        return CustomResponse.ok(result);
    }
    @Operation(summary = "나의 챌린지 조회", description = "현재 로그인한 사용자가 참여 중인 챌린지 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "COMMON200", description = "나의 챌린지 조회 성공",
                    content = @Content(schema = @Schema(implementation = AuthResponseDto.LoginResponse.class))),
            @ApiResponse(responseCode = "USER_404", description = "존재하지 않는 사용자입니다.", content = @Content),
    })
    @GetMapping("/me")
    public CustomResponse<List<ChallengeResponseDto.MyChallenge>> getMyChallenges(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        Long userId = user.getUserId();
        List<ChallengeResponseDto.MyChallenge> result = challengeService.getMyActiveChallenges(userId);
        return CustomResponse.ok(result);
    }

    @Operation(summary = "챌린지 참여 API", description = "특정 챌린지에 사용자가 참여합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "COMMON200", description = "챌린지 참여 성공",
                    content = @Content(schema = @Schema(implementation = AuthResponseDto.LoginResponse.class))),
            @ApiResponse(responseCode = "USER_404", description = "존재하지 않는 사용자입니다.", content = @Content),
            @ApiResponse(responseCode = "CHALLENGE404", description = "존재하지 않는 챌린지입니다.", content = @Content),
            @ApiResponse(responseCode = "PARTICIPATION400", description = "이미 참여 중인 챌린지입니다.", content = @Content),
    })
    @PostMapping("/{challengeId}/me")
    public CustomResponse joinChallenge(
            @Parameter(description = "챌린지 ID", example = "1")
            @PathVariable Long challengeId,
            @AuthenticationPrincipal CustomUserDetails user
            ){
        Long loginUserId = user.getUserId();
        String result = challengeService.joinChallenge(challengeId, loginUserId);
        return CustomResponse.ok(result);

    }

    @Operation(summary = "챌린지 탈퇴", description = "현재 로그인한 사용자가 챌린지 참여를 종료합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "COMMON200", description = "챌린지 탈퇴 성공",
                    content = @Content(schema = @Schema(implementation = AuthResponseDto.LoginResponse.class))),
            @ApiResponse(responseCode = "USER403", description = "권한이 없습니다.", content = @Content),
            @ApiResponse(responseCode = "PARTICIPATION404", description = "유저의 챌린지 참여 정보가 없습니다.", content = @Content),
            @ApiResponse(responseCode = "PARTICIPATION400", description = "이미 참여 중인 챌린지입니다.", content = @Content),
    })
    @PostMapping("/participations/{participationId}/me")
    public CustomResponse leaveChallenge(
            @Parameter(description = "챌린지 참여 ID", example = "1")
            @PathVariable Long participationId,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        Long userId = user.getUserId();
        String msg = challengeService.leaveChallenge(participationId, userId);
        return CustomResponse.ok(msg);
    }

    @Operation(
            summary = "챌린지 참여 여부 조회",
            description = "챌린지를 참여하고 있는지 True/False로 반환합니다."
    )
    @GetMapping("/{challengeId}/me")
    public CustomResponse<ChallengeResponseDto.ParticipationCheck> checkMyParticipation(
            @PathVariable Long challengeId,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        Long loginUserId = user.getUserId();

        ChallengeResponseDto.ParticipationCheck response =
                challengeService.checkParticipation(challengeId, loginUserId);

        return CustomResponse.ok(response);

    }




    @Tag(name = "Challenges-Room", description = "챌린지 채팅방")
    @Operation(
            summary = "챌린지 채팅방 조회",
            description = "해당 챌린지의 모든 인증글을 조회합니다. 쿼리 파라미터로는 PUBLIC/PRIVATE을 지정할 수 있습니다."
    )
    @GetMapping(("/{challengeId}/histories"))
    public CustomResponse<HistoryResponseDto.HistoryListResponse> getHistories(
            @PathVariable Long challengeId,
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam(name = "visibility", defaultValue = "PUBLIC") String visibilityStr
    ) {

        Long userId = user.getUserId();
        Visibility visibility = Visibility.valueOf(visibilityStr);

        HistoryResponseDto.HistoryListResponse response =
                historyService.getHistories(userId,challengeId, visibility);

        return CustomResponse.ok(response);
    }







}
