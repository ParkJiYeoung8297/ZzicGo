// src/pages/EditProfilePage.tsx
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../hooks/useUserInfo";
import UserAvatar from "../../components/mypage/UserAvatar";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useUserInfo();

  return (
    <div className="p-5 min-h-screen bg-white">
      {/* 뒤로가기 */}
      <div className="mt-2 text-2xl font-semibold cursor-pointer" onClick={() => navigate(-1)}>
        ←
      </div>

      {/* 아바타 */}
      <div className="mt-4 flex justify-center">
        <UserAvatar size={110} />
      </div>

      {/* 입력 영역 */}
      <div className="mt-10 space-y-6">
        {/* 닉네임 */}
        <div>
          <label className="font-semibold text-gray-700">닉네임</label>
          <input
            type="text"
            value={user.nickname}
            onChange={(e) => updateUser({ nickname: e.target.value })}
            className="w-full border p-3 rounded-xl mt-1"
          />
        </div>

        {/* 생년월일 (읽기 전용) */}
        <div>
          <label className="font-semibold text-gray-700">생년월일</label>
          <input
            type="text"
            value={user.birth || ""}          // ← API에서 birth 값 들어오는 경우
            readOnly
            className="w-full border p-3 rounded-xl mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* 이메일 주소 (읽기 전용) */}
        <div>
          <label className="font-semibold text-gray-700">이메일 주소</label>
          <input
            type="text"
            value={user.email || ""}
            readOnly
            className="w-full border p-3 rounded-xl mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* 성별 */}
        <div>
          <label className="font-semibold text-gray-700">성별</label>
          <select
            value={user.gender}
            onChange={(e) => updateUser({ gender: e.target.value as any })}
            className="w-full border p-3 rounded-xl mt-1"
          >
            <option value="FEMALE">여자</option>
            <option value="MALE">남자</option>
          </select>
        </div>
      </div>

      {/* 저장 버튼 */}
      <button className="w-full bg-[#F7C954] text-gray-800 p-4 rounded-2xl mt-12 font-semibold">
        저장하기
      </button>
    </div>
  );
}
