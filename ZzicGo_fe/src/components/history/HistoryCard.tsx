// src/components/history/HistoryCard.tsx
import { useState } from "react";
import type { HistoryItem } from "../../hooks/useChallengeHistory";

type Props = {
  item: HistoryItem;
  isMine: boolean;
};

export default function HistoryCard({ item, isMine }: Props) {
  const profileImage = item.profileImageUrl || "/profile_cheetah.png";

  // 🔥 클릭한 원본 이미지 보기 위한 상태
  const [openImage, setOpenImage] = useState<string | null>(null);

  return (
    <>
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
          <div className="mt-1">
            {/* 1장일 때 */}
            {item.images.length === 1 && (
              <div
                className="w-[250px] h-[250px] rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setOpenImage(item.images[0])}
              >
                <img
                  src={item.images[0]}
                  alt="history"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 2장 이상 */}
            {item.images.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {item.images.map((url, i) => (
                  <div
                    key={`${item.historyId}-${i}`}
                    className="w-[48%] rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => setOpenImage(url)}
                  >
                    <img src={url} alt="" className="w-full h-[180px] object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 내용 */}
        {item.content && (
          <div className="text-sm text-gray-800 leading-snug">
            {item.content}
          </div>
        )}
      </div>

      {/* 🔥 클릭 이미지 원본 전체보기 모달 */}
      {openImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setOpenImage(null)}
        >
          <img
            src={openImage}
            alt="original"
            className="max-w-[95%] max-h-[95%] rounded-xl shadow-lg"
          />
        </div>
      )}
    </>
  );
}
