// src/pages/challenge/ChallengeHistoryRoomPage.tsx

import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useChallengeHistory } from "../hooks/useChallengeHistory";
import HistoryCard from "../components/history/HistoryCard";
import VisibilityDropdown from "../components/history/VisibilityDropdown";
import { formatDate } from "../utils/formatDate";
import { getMyUserId } from "../utils/auth";

export default function ChallengeHistoryRoomPage() {
  const { challengeId } = useParams();
  const numericChallengeId = Number(challengeId);

  const location = useLocation();
  const { title } = location.state || { title: "" };

  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");

  const myUserId = getMyUserId();

  const { histories, loaderRef } = useChallengeHistory(
    numericChallengeId,
    visibility
  );


  // createdAt ASC 정렬 (채팅방 스타일)
  const sorted = [...histories].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="bg-[#F6E5B1] min-h-screen p-4 flex flex-col">

      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">{title}</h1>
        <VisibilityDropdown visibility={visibility} setVisibility={setVisibility} />
      </div>

      {/* 히스토리 */}
      <div className="flex flex-col gap-4">
        {sorted.map((h, index) => {
          const isMine = Number(h.userId) === myUserId;
          console.log({
  hUserId: h.userId,
  myUserId,
  equal: h.userId === myUserId
});

          const currentDate = formatDate(h.createdAt);
          const prevDate =
            index > 0 ? formatDate(sorted[index - 1].createdAt) : null;

          const showDate = currentDate !== prevDate;

          return (
            <div key={h.historyId}>
              {showDate && (
                <div className="text-center text-gray-600 text-sm my-4">
                  {currentDate}
                </div>
              )}

              <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <HistoryCard item={h} isMine={isMine} />
              </div>
            </div>
          );
        })}

        {/* 무한 스크롤 트리거 */}
        <div ref={loaderRef} className="h-10" />
      </div>
    </div>
  );
}
