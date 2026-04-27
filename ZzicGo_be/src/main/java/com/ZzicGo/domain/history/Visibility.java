package com.ZzicGo.domain.history;

import com.ZzicGo.exception.HistoryException;
import com.ZzicGo.global.CustomException;

public enum Visibility {
    PUBLIC,
    PRIVATE,
    FRIEND_ONLY;

    public static Visibility of(String visibilityStr){
        try {
            return Visibility.valueOf(visibilityStr);
        } catch (IllegalArgumentException e) {
            throw new CustomException(HistoryException.HISTORY_INVALID_VISIBILITY);
        }
    }
}