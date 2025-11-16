interface Props {
  challengeName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ChallengeJoinContent({
  challengeName,
  onClose,
  onConfirm,
}: Props) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-3">챌린지 참여</h2>
      <p className="mb-6 text-gray-700">
        “{challengeName}” 챌린지에 참여하시겠습니까?
      </p>

      <div className="flex gap-3">
        <button
          className="flex-1 py-2 rounded-xl bg-gray-200 text-gray-700"
          onClick={onClose}
        >
          닫기
        </button>

        <button
          className="flex-1 py-2 rounded-xl bg-[#F2BB2C] text-white"
          onClick={onConfirm}
        >
          참여하기
        </button>
      </div>
    </div>
  );
}
