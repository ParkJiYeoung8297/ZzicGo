// src/hooks/useUserInfo.ts
import { useState } from "react";

export interface UserInfo {
  nickname: string;
  gender: "MALE" | "FEMALE";
  email: string;
  birth: string;
  streak: number; // 연타
  totalDays: number; // 총 활동일
}

export const useUserInfo = () => {
  const [user, setUser] = useState<UserInfo>({
    nickname: "김치타",
    gender: "FEMALE",
    email: "si****@naver.com",
    birth: "2004-05-27",
    streak: 60,
    totalDays: 65,
  });

  const updateUser = (data: Partial<UserInfo>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return { user, updateUser };
};
