// src/hooks/useChallengeHistoryInfinite.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchChatMessages } from "../api/chat";
import type { HistoryResponse } from "../api/chat";


export function useChallengeHistoryInfinite(
  challengeId: number,
  visibility: "PUBLIC" | "PRIVATE"
) {
  return useInfiniteQuery<HistoryResponse, Error, HistoryResponse, [string, number, string], string | null>({
    queryKey: ["challengeHistory", challengeId, visibility],
    initialPageParam: null,

    queryFn: ({ pageParam = "" }) =>
      fetchChatMessages({
        roomId: challengeId,
        visibility,
        cursor: pageParam,
      }),

    getNextPageParam: (lastPage) =>
      lastPage.nextCursor ?? null,
  });
}
