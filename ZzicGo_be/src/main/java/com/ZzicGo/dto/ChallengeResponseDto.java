package com.ZzicGo.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class ChallengeResponseDto {

    @Getter
    @AllArgsConstructor
    public static class Challenge {
        private Long challengeId;
        private String name;
        private String description;
    }

    @Getter
    @AllArgsConstructor
    public static class MyChallenge{
        private Long participationId;
        private Long challengeId;
        private String name;
    }
}
