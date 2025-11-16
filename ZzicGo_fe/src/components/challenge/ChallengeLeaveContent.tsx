interface Props {
  challengeName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ChallengeLeaveContent({
  challengeName,
  onClose,
  onConfirm,
}: Props) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-3">챌린지 탈퇴</h2>

      <p className="text-gray-700 mb-6">
        “{challengeName}” 챌린지에서 탈퇴하시겠습니까?
      </p>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2 rounded-xl bg-gray-200 text-gray-700"
        >
          닫기
        </button>

        <button
          onClick={onConfirm}
          className="flex-1 py-2 rounded-xl bg-red-500 text-white"
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
}
