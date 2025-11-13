package com.ZzicGo.domain.history;

import com.ZzicGo.domain.challenge.ChallengeParticipation;
import com.ZzicGo.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "history")
public class History extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 참여 기록이 어떤 participation(챌린지 참여)와 연결되는지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participation_id", nullable = false)
    private ChallengeParticipation participation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Visibility visibility;   // PUBLIC, PRIVATE, FRIEND_ONLY

    @Column(columnDefinition = "TEXT")
    private String content;  // 사용자가 적는 인증 메시지

    // History 1 : N ImageUrl
    @OneToMany(mappedBy = "history", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ImageUrl> images = new ArrayList<>();

    // 연관관계 편의 메서드
    public void addImage(ImageUrl imageUrl) {
        images.add(imageUrl);
        imageUrl.setHistory(this);
    }

    public void updateContent(String content) {
        this.content = content;
    }

    public void updateVisibility(Visibility visibility) {
        this.visibility = visibility;
    }
}
