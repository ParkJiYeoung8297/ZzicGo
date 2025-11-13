package com.ZzicGo.domain.alarm;

import com.ZzicGo.domain.common.BaseEntity;
import com.ZzicGo.domain.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.util.Objects;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "notification_setting",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_type_channel",
                        columnNames = {"user_id", "type", "channel"}
                )
        }
)
public class NotificationSetting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 한 유저는 type + channel 조합별로 1개의 설정만 존재
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationChannel channel;

    @Column(nullable = false)
    private boolean isEnabled;

    // === 비즈니스 로직 ===
    public void enable() {
        this.isEnabled = true;
    }

    public void disable() {
        this.isEnabled = false;
    }
}

