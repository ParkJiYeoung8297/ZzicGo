// src/api/chat.ts
import apiClient from "./apiClient";

export interface HistoryImage {
  imageId: number;
  imageUrl: string;
}

export interface HistoryItem {
  historyId: number;
  userId: number;
  name: string;
  profileImageUrl: string | null;
  content: string | null;
  images: string[];
  imageDetails?: HistoryImage[];
  visibility: "PUBLIC" | "PRIVATE";
  createdAt: string;
}

export interface HistoryResponse {
  histories: HistoryItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface GetHistoryResponse {
  historyId: number;
  content: string | null;
  images: HistoryImage[];
  visibility: "PUBLIC" | "PRIVATE";
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}


export async function fetchChatMessages({
  roomId,
  cursor,
  visibility,
  size = 25,
}: {
  roomId: number;
  cursor: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  size?: number;
}): Promise<HistoryResponse> {
  const res = await apiClient.get<ApiResponse<HistoryResponse>>(
    
    `/api/z1/challenges/${roomId}/histories`,
    {
      params: {
        cursor,
        size,
        visibility,
      },
    }
  );

  // 서버 응답: { isSuccess, code, message, result: {...} }
  return res.data.result;
}
