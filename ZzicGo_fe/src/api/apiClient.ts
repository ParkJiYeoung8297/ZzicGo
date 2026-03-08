import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../utils/authStorage";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// refresh 중인지 체크
let isRefreshing = false;

// refresh 기다리는 요청들
let refreshSubscribers: ((token: string) => void)[] = [];

// 로그인 모달 중복 방지
let authExpiredTriggered = false;

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function triggerAuthExpired() {
  if (!authExpiredTriggered) {
    authExpiredTriggered = true;
    window.dispatchEvent(new Event("auth-expired"));
  }
}

const PUBLIC_URLS = [
  "/api/z1/auth/naver",
  "/api/z1/auth/kakao",
  "/api/z1/auth/refresh",
];

function isPublicUrl(url?: string) {
  return PUBLIC_URLS.some((publicUrl) => url?.includes(publicUrl));
}

// =========================
// 요청 interceptor
// =========================
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  // 토큰 없으면 모달
  if (!token && !isPublicUrl(config.url)) {
    clearTokens();
    triggerAuthExpired();
    return Promise.reject(new Error("No access token"));
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================
// 응답 interceptor
// =========================
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearTokens();
        triggerAuthExpired();
        return Promise.reject(error);
      }

      // refresh 중이면 기다림
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/z1/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          res.data.result;

        saveTokens(accessToken, newRefreshToken);

        isRefreshing = false;
        onRefreshed(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (err) {
        isRefreshing = false;

        clearTokens();
        triggerAuthExpired();

        return Promise.reject(err);
      }
    }

    // 권한 없음
    if (error.response?.status === 403) {
      alert("접근 권한이 없습니다.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;