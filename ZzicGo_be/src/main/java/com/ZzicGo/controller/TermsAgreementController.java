package com.ZzicGo.controller;

import com.ZzicGo.config.jwt.CustomUserDetails;
import com.ZzicGo.dto.TermsRequestDto;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.service.TermsAgreementService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/z1/terms")
@RequiredArgsConstructor
public class TermsAgreementController {

    private final TermsAgreementService termsAgreementService;

    @PatchMapping("/{termId}")
    public CustomResponse updateAgreement(
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
}

