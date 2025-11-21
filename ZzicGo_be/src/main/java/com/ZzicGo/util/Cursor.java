package com.ZzicGo.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class Cursor {
    private LocalDateTime createdAt;
    private Long id;
}
