package com.ZzicGo.controller;

import com.ZzicGo.config.jwt.CustomUserDetails;
import com.ZzicGo.dto.ChallengeResponseDto;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.service.ChallengeService;
import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(
            summary = "전체 챌린지 목록 조회",
            description = "활성화된 챌린지들의 이름과 설명을 조회합니다."
    )
    @GetMapping("/")
    public CustomResponse<List<ChallengeResponseDto.Challenges>> getChallenges(){
        List<ChallengeResponseDto.Challenges> result = challengeService.getAllActiveChallenges();
        return CustomResponse.ok(result);
    }

    @Operation(summary = "챌린지 참여 API", description = "특정 챌린지에 사용자가 참여합니다.")
    @PostMapping("/{challengeId}")
    public CustomResponse joinChallenge(
            @PathVariable Long challengeId,
            @AuthenticationPrincipal CustomUserDetails user
            ){
        Long loginUserId = user.getUserId();
        String result = challengeService.joinChallenge(challengeId, loginUserId);
        return CustomResponse.ok(result);

    }


}
