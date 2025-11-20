// src/components/history/HistoryCard.tsx
import type { HistoryItem } from "../../hooks/useChallengeHistory";

type Props = {
  item: HistoryItem;
  isMine: boolean;
};

export default function HistoryCard({ item, isMine }: Props) {
  const profileImage = item.profileImageUrl || "/profile_cheetah.png";

  return (
    <div
      className={`
        flex flex-col gap-3 p-4 pb-5 rounded-2xl shadow-sm
        ${isMine ? "bg-white ml-auto max-w-[70%]" : "bg-[#FEF8E7] mr-auto max-w-[80%]"}
      `}
    >
      {/* 프로필 + 이름 */}
      <div className="flex items-center gap-2">
        {!isMine && (
          <>
            <img src={profileImage} className="w-8 h-8 rounded-full object-cover" />
            <span className="text-sm font-semibold">{item.name}</span>
          </>
        )}
      </div>

      {/* 이미지 */}
      {item.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {item.images.map((url, i) => (
            <img
              key={`${item.historyId}-${i}`}
              src={url}
              className="w-[48%] rounded-lg border object-cover"
            />
          ))}
        </div>
      )}

      {/* 내용 */}
      {item.content && (
        <div className="text-sm text-gray-800 leading-snug">
          {item.content}
        </div>
      )}
    </div>
  );
}
