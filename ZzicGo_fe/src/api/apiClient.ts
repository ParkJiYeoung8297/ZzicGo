// src/api/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ⭐ 로그인 후 모든 요청에 자동으로 JWT 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // JWT를 제외하고 싶은 경로
  const publicPaths = [
    "/api/z1/challenges/",
  ];

  const isPublic = publicPaths.some(path =>
    config.url?.startsWith(path)
  );

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
