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
      className={`flex flex-col gap-2 p-3 max-w-[75%] rounded-xl ${
        isMine ? "bg-yellow-200" : "bg-white"
      }`}
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
              key={i}
              src={url}
              className="w-[48%] rounded-lg border object-cover"
            />
          ))}
        </div>
      )}

      {/* 내용 */}
      {item.content && (
        <div className="text-sm leading-snug whitespace-pre-wrap">
          {item.content}
        </div>
      )}
    </div>
  );
}
