import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useChallengeHistoryInfinite } from "../hooks/useChallengeHistoryInfinite";
import HistoryCard from "../components/history/HistoryCard";
import VisibilityDropdown from "../components/history/VisibilityDropdown";
import { formatDate } from "../utils/formatDate";
import { getMyUserId } from "../utils/auth";
import { PATH } from "../constants/paths";
import type { HistoryItem } from "../api/chat";

export default function ChallengeHistoryRoomPage() {
  const { challengeId } = useParams();
  const numericChallengeId = Number(challengeId);
  const navigate = useNavigate();

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
  const isFirstRender = useRef(true);

  /** ==============================
   *  🔥 무한 스크롤: 위로 스크롤 시 이전 페이지 로드
   * ============================== */
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    // console.log("🌀 scrollTop:", el.scrollTop);
    // console.log("🌀 scrollHeight:", el.scrollHeight);
    // console.log("🌀 clientHeight:", el.clientHeight);
    // console.log("🌀 hasNextPage:", hasNextPage);
    // console.log("🌀 isFetchingNextPage:", isFetchingNextPage);

    if (el.scrollTop <= 40 && hasNextPage && !isFetchingNextPage) {
      const oldHeight = el.scrollHeight;
      console.log("🚀 fetchNextPage 실행됨!");

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

  /** ==============================
   * 🔥 최초 렌더에서 최신 메시지를 맨 아래로 스크롤
   * ============================== */
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // 첫 렌더 때만 실행
    if (isFirstRender.current) {
      requestAnimationFrame(() => {
        scrollToBottom();

        // 이미지/텍스트 로딩 높이 변화를 고려해 한 번 더
        setTimeout(() => {
          scrollToBottom();
          isFirstRender.current = false;
        }, 50);
      });
    }
  }, [data]);

  /** ==============================
   * 🔥 페이지 데이터 평탄화 (ASC → 페이지역순 → flat)
   * ============================== */

  const pagesASC =
    data?.pages.map((page) =>
      [...page.histories].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      )
    ) ?? [];

  const histories = [...pagesASC].reverse().flat();

  const handleEdit = (item: HistoryItem) => {
    navigate(PATH.GO_HISTORY_EDIT(item.historyId), {
      state: {
        history: item,
        challengeId: numericChallengeId,
        title,
      },
    });
  };

  return (
    <div className="bg-[#F6E5B1] h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">{title}</h1>

        <VisibilityDropdown
          visibility={visibility}
          setVisibility={setVisibility}
        />
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto flex flex-col gap-4 px-4 pb-4"
      >
        {histories.map((h, index) => {
          const isMine = Number(h.userId) === myUserId;

          const currentDate = formatDate(h.createdAt);
          const prevDate =
            index > 0 ? formatDate(histories[index - 1].createdAt) : null;

          const showDate = currentDate !== prevDate;

          return (
            <div key={h.historyId}>
              {showDate && (
                <div className="text-center text-gray-600 text-sm my-4">
                  {currentDate}
                </div>
              )}

              <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <HistoryCard
                  item={h}
                  isMine={isMine}
                  visibility={h.visibility}
                  onEdit={isMine ? handleEdit : undefined}
                />
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
