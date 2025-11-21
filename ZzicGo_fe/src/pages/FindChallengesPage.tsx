import FilterBar from "../components/challenge/FilterBar";
import ChallengeCard from "../components/challenge/ChallengeCard";
import { useChallenges } from "../hooks/useChallenges";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import apiClient from "../api/apiClient";
import GenericModal from "../components/GeneralModal";
import ChallengeJoinContent from "../components/challenge/ChallengeJoinContent";
import { useNavigate } from "react-router-dom";



export default function FindChallengesPage() {
  const navigate = useNavigate();
  const { challenges, loading } = useChallenges();

  const [openModal, setOpenModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<{
    id: number;
    name: string;
  } | null>(null);



  //👇 Challenge 선택 시 팝업 열기
  const handleSelectChallenge = (id: number, name: string) => {
    setSelectedChallenge({ id, name });
    setOpenModal(true);
  };

  //👇 참여하기 API 요청
  const handleJoin = async () => {
    const token = localStorage.getItem("accessToken");
    console.log(token)

    if (!selectedChallenge) return;

    if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
    }


    try {
      await apiClient.post(`/api/z1/challenges/${selectedChallenge.id}/me`);
      alert("참여가 완료되었습니다!");
      setOpenModal(false);
    } catch (err: any) {{
      console.error(err);
      alert(err.response?.data?.message || "오류가 발생했습니다.");
}
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-10">
      {/* 헤더 */}
      <div className="px-4 pt-12 bg-white pb-4 shadow-sm">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold">챌린지 찾아보기</p>
        </div>

        {/* 모달창 */}
          <GenericModal open={openModal} onClose={() => setOpenModal(false)}>
            <ChallengeJoinContent
                challengeName={selectedChallenge?.name || ""}
                onClose={() => setOpenModal(false)}
                onConfirm={handleJoin}
            />
        </GenericModal>

        {/* 필터 + 검색창 전체 래핑 */}
<div className="relative pt-5 bg-white pb-4 shadow-sm">

  {/* 🔒 준비중 오버레이 */}
  <div className="absolute inset-0 bg-[#E5E5E5]/70 flex items-center justify-center z-20">
    <div className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full shadow">
      ⏳ 준비중인 기능입니다
    </div>
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
            onClick={() => handleSelectChallenge(item.challengeId, item.name)}
          />
        ))}
      </div>
    </div>
  );
}
