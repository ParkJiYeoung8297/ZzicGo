interface Props {
  challengeId: number;
  name: string;
  description: string;
  participated?: boolean;
  onClick?: () => void;
}

export default function ChallengeCard({
  name,
  description,
  participated = false,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm mb-3 cursor-pointer"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold">{name}</p>
        {participated && (
          <span className="shrink-0 rounded-full bg-[#F7E7C4] px-3 py-1 text-xs font-semibold text-[#834909]">
            참여중
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}
