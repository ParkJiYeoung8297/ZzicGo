import { IoIosNotificationsOutline } from "react-icons/io";
import Calendar from "../components/Calendar";
import { useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { useMyChallenges } from "../hooks/useMyChallenges";

export default function MainPage() {
  const navigate = useNavigate();
  const { myChallenges, loading } = useMyChallenges();

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
              className="bg-yellow-300 rounded-xl px-4 py-3 text-gray-900 shadow flex items-center justify-between"
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
