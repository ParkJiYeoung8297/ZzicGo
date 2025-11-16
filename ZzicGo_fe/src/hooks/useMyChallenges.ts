import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export interface MyChallenge {
  participationId: number;
  challengeId: number;
  name: string;
}

export function useMyChallenges() {
  const [myChallenges, setMyChallenges] = useState<MyChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/api/z1/challenges/me")
      .then((res) => {
        setMyChallenges(res.data.result || []);
      })
      .catch((err) => {
        console.error("내 챌린지 불러오기 실패:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { myChallenges, loading };
}
