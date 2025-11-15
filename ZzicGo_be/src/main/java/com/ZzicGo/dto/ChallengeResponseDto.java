package com.ZzicGo.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class ChallengeResponseDto {

    @Getter
    @AllArgsConstructor
    public static class Challenges {
        private Long challengeId;
        private String name;
        private String description;
    }
}
