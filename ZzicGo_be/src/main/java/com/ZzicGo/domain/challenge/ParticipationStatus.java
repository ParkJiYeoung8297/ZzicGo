package com.ZzicGo.domain.challenge;

public enum ParticipationStatus {
    JOINED,
    LEFT;

    public boolean isJOINED() {
        return this == JOINED;
    }
}
