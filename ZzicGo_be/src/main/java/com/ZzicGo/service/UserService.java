package com.ZzicGo.service;

import com.ZzicGo.domain.user.Gender;
import com.ZzicGo.domain.user.User;
import com.ZzicGo.dto.UserRequestDto;
import com.ZzicGo.dto.UserResponseDto;
import com.ZzicGo.exception.UserException;
import com.ZzicGo.global.CustomException;
import com.ZzicGo.global.s3.S3Uploader;
import com.ZzicGo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final S3Uploader s3Uploader;
    private final String PROFILE_DIR = "profile";

    @Transactional(readOnly = true)
    public UserResponseDto.Profile getMyProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(UserException.NOT_EXIST_USER));

        String gender = user.getGender() != null ? user.getGender().name() : null;
        return new UserResponseDto.Profile(
                user.getId(),
                user.getNickname(),
                user.getEmail(),
                user.getBirth(),
                gender,
                user.getProfileImageUrl()
        );
    }

    public void updateMyProfile(Long userId, UserRequestDto.ProfileUpdate request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(UserException.NOT_EXIST_USER));

        if (request.getNickname() == null || request.getNickname().isBlank()) {
            throw new CustomException(UserException.INVALID_NICKNAME);
        }

        String genderValue = request.getGender();
        Gender gender;

        if (genderValue == null) {
            throw new CustomException(UserException.INVALID_GENDER);
        }

        try {
            gender = Gender.valueOf(genderValue);
        } catch (IllegalArgumentException e) {
            throw new CustomException(UserException.INVALID_GENDER);
        }

        user.updateNickname(request.getNickname());
        user.updateGender(gender);
    }

    /**
     * 🔹 프로필 이미지 변경
     */
    @Transactional
    public UserResponseDto.Profile updateProfileImage(Long userId, MultipartFile newImage) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(UserException.NOT_EXIST_USER));

        if (newImage == null || newImage.isEmpty()) {
            throw new IllegalArgumentException("이미지가 없습니다.");
        }

        String oldImageKey = user.getProfileImageUrl();

        // ⭐ 새 이미지 업로드
        String newImageKey = s3Uploader.uploadFile(PROFILE_DIR, newImage);

        // 엔티티 업데이트
        user.setProfileImageUrl(newImageKey);

        // ⭐ 기존 이미지 삭제
        if (oldImageKey != null) {
            s3Uploader.deleteFile(oldImageKey);
        }

        // ⭐ presigned URL 변환
        String presigned = s3Uploader.getPresignedUrl(newImageKey);

        return UserResponseDto.Profile.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .birth(user.getBirth())
                .gender(user.getGender().name())
                .profileImageUrl(presigned)
                .build();
    }
}

