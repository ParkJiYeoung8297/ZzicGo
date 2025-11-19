// src/hooks/useChallengeHistory.ts
import { useState, useEffect, useRef } from "react";
import throttle from "lodash.throttle";
import apiClient from "../api/apiClient";

export interface HistoryItem {
  historyId: number;
  userId: number
  name: string;
  profileImageUrl: string | null; // null 가능 → 기본 이미지 적용
  content: string;
  images: string[];
}

export const useChallengeHistory = (
  challengeId: number,
  visibility: "PUBLIC" | "PRIVATE"
) => {
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = async () => {
    if (!hasMore) return;

    const res = await apiClient.get(
      `/api/z1/challenges/${challengeId}/histories`,
      {
        params: {
          visibility,
          cursor: cursor ?? "",
          size: 10
        }
      }
    );

    const data = res.data.result;

    setHistories((prev) => [...prev, ...data.histories]);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);
  };

  // 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      throttle((entries) => {
        if (entries[0].isIntersecting) loadMore();
      }, 300),
      { threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loaderRef, visibility]);

  // visibility 바뀔 때 초기화
  useEffect(() => {
    setHistories([]);
    setCursor(null);
    setHasMore(true);
  }, [visibility]);

  return { histories, loaderRef, hasMore };
};
