package com.ZzicGo.dto;

import com.ZzicGo.domain.user.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

public class UserRequestDto {
    @Getter
    public static class ProfileUpdate {

        @Schema(
                description = "닉네임",
                example = "너무 빠른 여우 7345"
        )
        @NotBlank
        private String nickname;

        @Schema(
                description = "성별",
                example = "FEMALE"
        )
        @NotBlank
        private String gender;
    }

}
