package com.ZzicGo.dto;

public class TermsResponseDto {
    public record AgreementStatus(
            Long termsId,
            String termsTitle,
            String version,
            boolean isRequired,
            boolean isAgreed
    ) {}
}
