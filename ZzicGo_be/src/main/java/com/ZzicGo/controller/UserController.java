package com.ZzicGo.controller;


import com.ZzicGo.config.jwt.CustomUserDetails;
import com.ZzicGo.dto.UserRequestDto;
import com.ZzicGo.dto.UserResponseDto;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name="User", description = "유저")
@RestController
@RequestMapping("/api/z1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @Operation(summary = "내 정보 조회 api", description = "나의 정보를 조회합니다.")
    @GetMapping("/me")
    public CustomResponse<UserResponseDto.Profile> getMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUserId();
        return CustomResponse.ok(userService.getMyProfile(userId));
    }

    @Operation(summary = "나의 정보 수정 api", description = "나의 정보를 수정합니다. 단, 이메일과 생년월일은 수정할 수 없습니다.")
    @PatchMapping("/me")
    public CustomResponse<String> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid UserRequestDto.ProfileUpdate request
    ) {
        Long userId = userDetails.getUserId();
        userService.updateMyProfile(userId, request);
        return CustomResponse.ok("프로필 수정 완료");
    }

    @Operation(summary = "나의 프로필 사진 수정 api", description = "나의 프로필 사진을 수정합니다.")
    @PatchMapping(
            value = "/me/profile-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public UserResponseDto.Profile updateProfileImage(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestPart("profileImage") MultipartFile profileImg
    ) {
        return userService.updateProfileImage(user.getUserId(), profileImg);
    }

}
