// src/pages/challenge/ChallengeHistoryPage.tsx

import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useChallengeHistory } from "../hooks/useChallengeHistory";
import HistoryCard from "../components/history/HistoryCard";
import VisibilityDropdown from "../components/history/VisibilityDropdown";

export default function ChallengeHistoryRoomPage() {
  const { challengeId } = useParams();
  const numericChallengeId = Number(challengeId);

  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");

  const myUserId = Number(localStorage.getItem("userId")); 

  const location = useLocation();
  const { title } = location.state || { title: "임시방" };
  const { histories, loaderRef } = useChallengeHistory(
    numericChallengeId,
    visibility
  );

  return (
    <div className="bg-[#F6E5B1] min-h-screen p-4">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">{title}</h1>
        <VisibilityDropdown visibility={visibility} setVisibility={setVisibility} />
      </div>

      {/* 히스토리 리스트 */}
      <div className="flex flex-col gap-6">
        {histories.map(h => {
          const isMine = h.userId === myUserId;

          return (
            <div
              key={h.historyId}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <HistoryCard item={h} />
            </div>
          );
        })}

        {/* 무한스크롤 trigger */}
        <div ref={loaderRef} className="h-10" />
      </div>
    </div>
  );
}
