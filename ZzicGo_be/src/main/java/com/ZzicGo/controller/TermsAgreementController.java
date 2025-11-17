package com.ZzicGo.controller;

import com.ZzicGo.config.jwt.CustomUserDetails;
import com.ZzicGo.dto.TermsRequestDto;
import com.ZzicGo.dto.TermsResponseDto;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.service.TermsAgreementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name="Terms", description = "약관")
@RestController
@RequestMapping("/api/z1/terms")
@RequiredArgsConstructor
public class TermsAgreementController {

    private final TermsAgreementService termsAgreementService;
    @Operation(summary = "약관 동의 여부 변경 API", description = "약관 동의 여부를 변경합니다. 동의 여부를 true/false로 보내주세요")
    @PatchMapping("/{termId}")
    public CustomResponse updateAgreement(
            @Parameter(description = "약관 ID", example = "1")
            @PathVariable Long termId,
            @RequestBody TermsRequestDto.AgreementUpdate request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        termsAgreementService.updateAgreement(
                userDetails.getUserId(),
                termId,
                request.isAgreed()
        );

        return CustomResponse.ok("약관 동의 상태가 변경되었습니다.");
    }

    @Operation(summary = "약관 동의 여부 조회 API", description = "약관 동의 여부를 조회합니다.")
    @GetMapping("/{termsId}/me")
    public CustomResponse<TermsResponseDto.AgreementStatus> getMyAgreementStatus(
            @Parameter(description = "약관 ID", example = "1")
            @PathVariable Long termsId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        TermsResponseDto.AgreementStatus response =
                termsAgreementService.getMyAgreementStatus(
                        userDetails.getUserId(),
                        termsId
                );

        return CustomResponse.ok(response);
    }
}

