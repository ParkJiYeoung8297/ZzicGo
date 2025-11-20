// src/pages/EditProfilePage.tsx
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../hooks/useUserInfo";
import UserAvatar from "../../components/mypage/UserAvatar";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useUserInfo();

  return (
    <div className="p-5 min-h-screen bg-white">
      <div className="mt-2" onClick={() => navigate(-1)}>←</div>

      <div className="mt-4 flex justify-center">
        <UserAvatar size={100} />
      </div>

      <div className="mt-8">
        {/* 닉네임 */}
        <label className="font-semibold">닉네임</label>
        <input
          type="text"
          value={user.nickname}
          onChange={(e) => updateUser({ nickname: e.target.value })}
          className="w-full border p-3 rounded-xl mt-1"
        />

        {/* 성별 */}
        <label className="font-semibold mt-6 block">성별</label>
        <select
          value={user.gender}
          onChange={(e) => updateUser({ gender: e.target.value as any })}
          className="w-full border p-3 rounded-xl mt-1"
        >
          <option value="FEMALE">여자</option>
          <option value="MALE">남자</option>
        </select>
      </div>

      <button className="w-full bg-yellow-500 text-white p-3 rounded-xl mt-10">
        저장하기
      </button>
    </div>
  );
}
