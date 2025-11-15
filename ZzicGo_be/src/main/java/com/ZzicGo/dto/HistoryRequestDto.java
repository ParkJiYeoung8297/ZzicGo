package com.ZzicGo.dto;

import com.ZzicGo.domain.history.Visibility;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;


public class HistoryRequestDto {

    @Getter
    @NoArgsConstructor
    public static class CreateHistoryRequest {
        @Schema(
                description = "업로드된 인증 사진의 S3 URL 리스트 (최대 3개)",
                example = "[\"https://s3.amazonaws.com/bucket/image1.jpg\", \"https://s3.amazonaws.com/bucket/image2.jpg\"]"
        )
        private List<String> imageUrls;

        @Schema(
                description = "인증 글 내용",
                example = "3주차 미션 성공! 모두 화이팅!"
        )
        private String content;

        @Schema(
                description = "공개 범위 선택 (PUBLIC, PRIVATE)",
                example = "PUBLIC"
        )
        private Visibility visibility;
    }
}
