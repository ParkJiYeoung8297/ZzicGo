// src/components/history/HistoryCard.tsx
import type { HistoryItem } from "../../hooks/useChallengeHistory";

type Props = {
  item: HistoryItem;
};

export default function HistoryCard({ item }: Props) {
  const profileImage = item.profileImageUrl || "/profile_cheetah.png";

  return (
    <div className="flex flex-col gap-2 p-3">
      {/* 프로필 */}
      <div className="flex items-center gap-2">
        <img
          src={profileImage}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-sm font-semibold">{item.name}</span>
      </div>

      {/* 인증 이미지 */}
      <div className="flex flex-wrap gap-2 mt-1">
        {item.images.map((url, i) => (
          <img
            key={i}
            src={url}
            className="w-[45%] rounded-md border object-cover"
          />
        ))}
      </div>

      {/* 텍스트 */}
      {item.content && (
        <div className="bg-yellow-300 text-xs px-3 py-1 rounded-lg inline-block mt-1">
          {item.content}
        </div>
      )}
    </div>
  );
}
