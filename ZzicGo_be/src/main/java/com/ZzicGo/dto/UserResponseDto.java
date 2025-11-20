package com.ZzicGo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

public class UserResponseDto {
    @Getter
    @AllArgsConstructor
    @Builder
    public static class Profile{
        private Long id;
        private String nickname;
        private String email;
        private LocalDate birth;
        private String gender;
        private String profileImageUrl;
    }
}
