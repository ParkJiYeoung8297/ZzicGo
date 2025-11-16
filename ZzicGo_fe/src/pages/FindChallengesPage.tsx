import FilterBar from "../components/challenge/FilterBar";
import ChallengeCard from "../components/challenge/ChallengeCard";
import { useChallenges } from "../hooks/useChallenges";
import { AiOutlineSearch } from "react-icons/ai";

export default function FindChallengesPage() {
  const { challenges, loading } = useChallenges();

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-10">
      {/* 헤더 */}
      <div className="px-4 pt-12 bg-white pb-4 shadow-sm">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold">챌린지 찾아보기</p>
        </div>

        <FilterBar />

        {/* 검색창 */}
        <div className="mt-4">
          <div className="bg-white rounded-full border px-4 py-2 flex items-center">
            <input
              type="text"
              placeholder="검색"
              className="flex-1 outline-none"
            />
            <AiOutlineSearch size={22} />
          </div>
        </div>
      </div>

      {/* 목록 */}
      <div className="px-4 mt-4">
        {loading && <p>로딩중...</p>}

        {challenges.map((item) => (
          <ChallengeCard
            key={item.challengeId}
            challengeId={item.challengeId}
            name={item.name}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}
