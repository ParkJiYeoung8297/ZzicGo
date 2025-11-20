// src/hooks/useUserInfo.ts
import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

export interface UserInfo {
  id: number;
  nickname: string;
  email: string;
  birth: string | null;
  gender: "FEMALE" | "MALE" | "NONE";
  profileImageUrl: string | null;
}

export function useUserInfo() {
  const [user, setUser] = useState<UserInfo>({
    id: 0,
    nickname: "",
    email: "",
    birth: "",
    gender: "FEMALE",
    profileImageUrl: null,
  });

  // ▶ 사용자 정보 업데이트용 함수
  const updateUser = (updated: Partial<UserInfo>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  // ▶ 페이지 진입 시 자동 호출
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/api/z1/users/me");
        if (res.data?.result) {
          setUser(res.data.result);
        }
      } catch (err) {
        console.error("❌ 사용자 정보 조회 실패:", err);
      }
    };

    fetchUser();
  }, []);

  return { user, updateUser };
}
