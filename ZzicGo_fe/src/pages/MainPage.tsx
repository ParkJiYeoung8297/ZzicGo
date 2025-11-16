import { IoIosNotificationsOutline } from "react-icons/io";
import Calendar from "../components/Calendar";
import { useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { useMyChallenges } from "../hooks/useMyChallenges";
import GenericModal from "../components/GeneralModal";
import ChallengeLeaveContent from "../components/challenge/ChallengeLeaveContent";
import { useState } from "react";
import apiClient from "../api/apiClient";

export default function MainPage() {
  const navigate = useNavigate();
  const { myChallenges, loading } = useMyChallenges();

  // 🔥 모달 상태
  const [openModal, setOpenModal] = useState(false);

  // 🔥 선택된 챌린지 저장
  const [selectedChallenge, setSelectedChallenge] = useState<{
    participationId: number;
    name: string;
  } | null>(null);

  // 챌린지 클릭 → 탈퇴 팝업 열기
  const handleSelectChallenge = (challenge: any) => {
    setSelectedChallenge({
      participationId: challenge.participationId,
      name: challenge.name,
    });
    setOpenModal(true);
  };

  // 탈퇴 요청
  const handleLeave = async () => {
    if (!selectedChallenge) return;

    try {
      await apiClient.post(
        `/api/z1/challenges/participations/${selectedChallenge.participationId}/me`
      );

      alert("챌린지에서 탈퇴했습니다.");
      window.location.reload(); // 또는 상태 관리 방식으로 자체 업데이트
    } catch (err) {
      console.error(err);
      alert("탈퇴 중 오류가 발생했습니다.");
    } finally {
      setOpenModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-5 pt-5 pb-16">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between mb-4">
        <IoIosNotificationsOutline className="text-3xl text-gray-800" />
        <img
          src="profile_cheetah.png"
          alt="profile"
          className="w-10 h-10 rounded-full border border-gray-200"
        />
      </header>

      {/* 제목 */}
      <h1 className="text-2xl font-bold text-gray-900 mb-4">나의 챌린지</h1>

      {/* 캘린더 */}
      <Calendar />

      {/* 🔥 탈퇴 팝업 */}
      <GenericModal open={openModal} onClose={() => setOpenModal(false)}>
        <ChallengeLeaveContent
          challengeName={selectedChallenge?.name || ""}
          onClose={() => setOpenModal(false)}
          onConfirm={handleLeave}
        />
      </GenericModal>

      {/* 로딩 */}
      {loading && (
        <div className="mt-10 text-center text-gray-400">불러오는 중...</div>
      )}

      {/* 참여 중 챌린지 리스트 */}
      {!loading && myChallenges.length > 0 && (
        <div className="mt-6 space-y-3">
          {myChallenges.map((c) => (
            <div
              key={c.participationId}
              className="bg-yellow-300 rounded-xl px-4 py-3 text-gray-900 shadow flex items-center justify-between cursor-pointer"
              onClick={() => handleSelectChallenge(c)} // 🔥 클릭 시 팝업
            >
              <span className="font-semibold">{c.name}</span>
              <span className="text-sm text-green-700 font-bold">P</span>
            </div>
          ))}
        </div>
      )}

      {/* 참여 중인 챌린지가 없을 때 */}
      {!loading && myChallenges.length === 0 && (
        <div className="mt-10 text-center text-gray-500">
          아직 참여 중인 챌린지가 없어요
        </div>
      )}

      {/* 챌린지 추가 버튼 */}
      <div className="mt-12 text-center">
        <button
          className="text-gray-700 text-lg font-semibold underline"
          onClick={() => navigate(PATH.Z1_CHALLENGES)}
        >
          + 챌린지 추가
        </button>
      </div>
    </div>
  );
}
