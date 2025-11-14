package com.ZzicGo.domain.alarm;

import com.ZzicGo.domain.common.BaseEntity;
import com.ZzicGo.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "fcm_token",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_fcm_token_token",
                        columnNames = {"token"}
                )
        }
)
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class FcmToken extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 유저와 다대일 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // FCM 기기 토큰
    @Column(nullable = false, length = 500)
    private String token;

    // 디바이스 타입: WEB, ANDROID, IOS
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DeviceType deviceType;

    // OS 정보
    @Column(name = "device_os", length = 100)
    private String deviceOs;

    // 브라우저 정보
    @Column(name = "device_browser", length = 100)
    private String deviceBrowser;

    // 유효 여부
    @Column(nullable = false)
    private boolean isValid = true;

    // 토큰 무효화 처리
    public void invalidate() {
        this.isValid = false;
    }
}
