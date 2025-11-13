package com.ZzicGo.domain.history;

import com.ZzicGo.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "image_url")
public class ImageUrl extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 history에 속한 이미지인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "history_id", nullable = false)
    private History history;

    @Column(name = "image_url", length = 150, nullable = false)
    private String imageUrl;

    @Column(name = "order_number")
    private Integer orderNumber;

    public void setHistory(History history) {
        this.history = history;
    }
}

