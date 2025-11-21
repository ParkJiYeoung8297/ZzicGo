// src/hooks/useChallengeHistory.ts

import { useState, useEffect, useRef } from "react";
import throttle from "lodash.throttle";
import apiClient from "../api/apiClient";

export interface HistoryItem {
  historyId: number;
  userId: number;
  name: string;
  profileImageUrl: string | null;
  content: string;
  images: string[];
  createdAt: string;
}

export const useChallengeHistory = (
  challengeId: number,
  visibility: "PUBLIC" | "PRIVATE"
) => {
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false);

  const loadMore = async () => {
    if (!hasMore || loadingRef.current) return;

    loadingRef.current = true;

    const res = await apiClient.get(
      `/api/z1/challenges/${challengeId}/histories`,
      {
        params: {
          visibility,
          cursor: cursor ?? "",
          size: 10,
        },
      }
    );

    const data = res.data.result;

    setHistories((prev: HistoryItem[]) => {
      const incoming: HistoryItem[] = data.histories;

      const unique = incoming.filter(
        (item: HistoryItem) => !prev.some((p) => p.historyId === item.historyId)
      );

      return [...prev, ...unique];
    });

    setCursor(data.nextCursor);
    setHasMore(data.hasMore);
    loadingRef.current = false;
  };

  const setupObserver = () => {
    if (!loaderRef.current) return;

    observerRef.current = new IntersectionObserver(
      throttle((entries) => {
        if (entries[0].isIntersecting) loadMore();
      }, 200),
      { threshold: 0 }
    );

    observerRef.current.observe(loaderRef.current);
  };

  // visibility 변경 시 완전 초기화
  useEffect(() => {
    observerRef.current?.disconnect();

    setHistories([]);
    setCursor(null);
    setHasMore(true);
    loadingRef.current = false;

    (async () => {
      await loadMore();
      setupObserver();
    })();
  }, [visibility, challengeId]);

  return { histories, loaderRef, hasMore };
};
