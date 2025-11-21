// src/pages/MyPage.tsx
import { useNavigate } from "react-router-dom";
import UserAvatar from "../../components/mypage/UserAvatar";
import InfoRow from "../../components/mypage/InfoRow";
import ActivityHeatmap from "../../components/mypage/ActivityHeatmap";
import { useUserInfo } from "../../hooks/useUserInfo";
import apiClient from "../../api/apiClient";
import { PATH } from "../../constants/paths";

export default function MyPage() {
  const navigate = useNavigate();
  const { user } = useUserInfo();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete apiClient.defaults.headers.common["Authorization"];
    navigate(PATH.LOGIN);
  };

  return (
    <div className="bg-[#F7E7C4] min-h-screen flex justify-center">
      <div className="w-full max-w-md">

        {/* 🔥 1. 헤더 */}
        <div className="p-5 pb-3">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <span className="text-2xl">←</span>
            <span className="text-lg font-semibold">마이페이지</span>
          </div>
        </div>

        {/* 🔥 2. 프로필카드 */}
        <div className="px-5 mt-2">
          <div className="bg-white p-6 rounded-3xl shadow-md">
            <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">
              {/* 프로필 이미지 */}
              <UserAvatar size={100} />

              {/* 오른쪽 영역 → 세로 배치 */}
              <div className="flex flex-col">
                <div className="text-xl font-semibold break-words">
                  {user.nickname}
                </div>

                <button
                  className="bg-[#F7C954] text-gray-800 px-4 py-2 rounded-full text-sm shadow-sm mt-2 w-fit"
                  onClick={() => navigate(PATH.Z1_MY_PROFILE_PAGE)}
                >
                  내 정보 수정 →
                </button>
              </div>
            </div>


            </div>
          </div>
        </div>

        {/* 🔥 3+4. 연타/활동일 + 히트맵 */}
        <div className="relative px-5 mt-4">
          <div className="opacity-40 pointer-events-none">

            {/* 연타/총 활동일 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-5 rounded-2xl shadow text-center">
                <div className="text-sm text-gray-600">연타</div>
                <div className="text-xl font-bold">60일 🔥</div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow text-center">
                <div className="text-sm text-gray-600">총 활동일</div>
                <div className="text-xl font-bold">65일</div>
              </div>
            </div>

            <ActivityHeatmap />
          </div>

          {/* 🔒 준비중 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full shadow font-medium -translate-y-14">
              ⏳ 준비중인 기능입니다
            </div>
          </div>
        </div>

        {/* 🔥 5. 설정 */}
        <div className="bg-white mt-6 rounded-xl shadow px-4 py-2">
          <InfoRow
            title="서비스 이용약관"
            onClick={() =>
              window.open(
                "https://iodized-chartreuse-9ca.notion.site/2ae0b06a074280f48f79fe33d68040d7",
                "_blank"
              )
            }
          />
          <InfoRow
            title="개인정보 처리방침"
            onClick={() =>
              window.open(
                "https://iodized-chartreuse-9ca.notion.site/2ae0b06a0742809a9fa9e1b1fffa7469",
                "_blank"
              )
            }
          />
        </div>

        {/* 🔥 6. 로그아웃 */}
        <div className="text-center text-sm mt-6 mb-10 text-gray-400">
          <span className="cursor-pointer" onClick={handleLogout}>
            로그아웃
          </span>
          {" | "}
          <span className="cursor-pointer">회원탈퇴</span>
        </div>

      </div>
    </div>
  );
}
