import { AiOutlineHeart } from "react-icons/ai";
import type { Challenge } from "../hooks/userChallenges";

export default function ChallengeCard({ name, description }: Challenge) {
  return (
    <div className="w-full bg-white rounded-xl p-5 shadow-sm flex justify-between items-center mt-4">
      <div>
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-gray-400 mt-2 text-sm">{description}</p>
      </div>
      <AiOutlineHeart size={26} className="text-yellow-800" />
    </div>
  );
}
