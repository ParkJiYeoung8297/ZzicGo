import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useChallengeHistoryInfinite } from "../hooks/useChallengeHistoryInfinite";
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

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useChallengeHistoryInfinite(numericChallengeId, visibility);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  /** 🔥 위로 스크롤하면 이전 페이지 fetchNextPage 실행 */
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    // 약간 여유를 줘야 안정적
    if (el.scrollTop <= 20 && hasNextPage && !isFetchingNextPage) {
      const oldHeight = el.scrollHeight;
      fetchNextPage().then(() => {
        requestAnimationFrame(() => {
          const newHeight = el.scrollHeight;
          el.scrollTop = newHeight - oldHeight;
        });
      });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage]);

  /** 🔥 첫 렌더 시 맨 아래로 스크롤 */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [data]);

  /** 🔥 전체 히스토리 평탄화 */
  const histories =
    data?.pages.flatMap((p) => p.histories) ?? [];

  /** 🔥 createdAt ASC 정렬 */
  const sorted = [...histories].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  );

  return (
    <div className="bg-[#F6E5B1] min-h-screen p-4 flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">{title}</h1>

        <VisibilityDropdown
          visibility={visibility}
          setVisibility={setVisibility}
        />
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto flex flex-col gap-4"
      >
        {sorted.map((h, index) => {
          const isMine = Number(h.userId) === myUserId;

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
                <HistoryCard item={h} isMine={isMine} visibility={h.visibility}/>
              </div>
            </div>
          );
        })}

        {/* 로딩 표시 */}
        {isFetchingNextPage && (
          <div className="text-center text-gray-500">불러오는 중...</div>
        )}
      </div>
    </div>
  );
}