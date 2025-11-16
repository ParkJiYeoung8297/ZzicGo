import { AiOutlineHeart } from "react-icons/ai";
import type { Challenge } from "../../hooks/useChallenges";

interface Props {
  challengeId: number;
  name: string;
  description: string;
  onClick?: () => void;
}

export default function ChallengeCard({ name, description, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm mb-3 cursor-pointer"
    >
      <p className="font-semibold">{name}</p>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}
