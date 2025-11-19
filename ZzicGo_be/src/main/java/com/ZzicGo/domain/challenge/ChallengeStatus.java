package com.ZzicGo.domain.challenge;

public enum ChallengeStatus {
    ACTIVATE, STOP;

    public boolean isActive() {
        return this == ACTIVATE;
    }
}
