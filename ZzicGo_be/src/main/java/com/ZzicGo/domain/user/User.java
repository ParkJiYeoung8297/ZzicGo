package com.ZzicGo.domain.user;

import com.ZzicGo.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user")
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String email;

    @Column(nullable = false, length = 20)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private Gender gender;

    private LocalDate birth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status; // ACTIVE, INACTIVE, DELETED

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider; // NAVER, KAKAO, GOOGLE

    @Column(nullable = false, length = 50)
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // ADMIN, USER

    @Column(length = 150)
    private String profileImageUrl;

    private LocalDateTime lastLoginAt;

    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
    }

}

