package com.ZzicGo.util;

import java.security.SecureRandom;
import java.util.List;

public class RandomNicknameGenerator {

    private static final List<String> ADJECTIVES = List.of(
            "빠른", "용감한", "행복한", "신나는", "총명한", "귀여운",
            "영리한", "당당한", "선명한", "부지런한", "싱그러운"
    );

    private static final List<String> ANIMALS = List.of(
            "치타", "토끼", "고양이", "호랑이", "부엉이",
            "사자", "여우", "판다", "펭귄", "돌고래"
    );

    private static final SecureRandom RANDOM = new SecureRandom();

    // 기본 닉네임 생성
    public static String generate() {
        String adjective = ADJECTIVES.get(RANDOM.nextInt(ADJECTIVES.size()));
        String animal = ANIMALS.get(RANDOM.nextInt(ANIMALS.size()));

        // 중복 방지용 4자리 난수 추가
        int number = RANDOM.nextInt(9000) + 1000;  // 1000~9999

        return adjective + animal + number;
    }

    // 길이 제한 버전 (선택)
    public static String generate(int maxLength) {
        String nickname = generate();
        if (nickname.length() > maxLength) {
            return nickname.substring(0, maxLength);
        }
        return nickname;
    }
}

