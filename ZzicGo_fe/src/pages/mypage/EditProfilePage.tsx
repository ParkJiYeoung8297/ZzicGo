import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../hooks/useUserInfo";
import UserAvatar from "../../components/mypage/UserAvatar";
import apiClient from "../../api/apiClient";
import { useRef, useState } from "react";
import { FaPen } from "react-icons/fa";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useUserInfo();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setImageUploading(true);

      const res = await apiClient.patch("/api/z1/users/me/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateUser(res.data?.result ?? res.data);
    } catch (err) {
      console.error("프로필 이미지 수정 오류:", err);
      alert("프로필 이미지 수정 중 오류가 발생했습니다.");
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const body = {
        nickname: user.nickname,
        gender: user.gender,
      };

      const res = await apiClient.patch("/api/z1/users/me", body);

      // 서버가 업데이트된 유저 정보를 반환한다고 가정
      if (res.data?.result) {
        updateUser(res.data.result); // 🔥 업데이트된 정보 반영
      }

      // 새로고침
      window.location.reload(); 
    } catch (err) {
      console.error("업데이트 오류:", err);
      alert("정보 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 min-h-screen bg-white">
      {/* 뒤로가기 */}
      <div className="mt-2 text-2xl font-semibold cursor-pointer" onClick={() => navigate(-1)}>
        ←
      </div>

      {/* 아바타 */}
      <div className="mt-4 flex justify-center">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            className="relative rounded-full"
            onClick={() => imageInputRef.current?.click()}
            disabled={imageUploading}
          >
            <UserAvatar size={110} imageUrl={user.profileImageUrl} />
            <span className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#F7C954] text-white shadow">
              <FaPen size={12} />
            </span>
          </button>

          {imageUploading && (
            <p className="text-sm text-gray-500">업로드 중...</p>
          )}

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleProfileImageChange}
          />
        </div>
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
            value={user.birth || ""}
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
            <option value="NONE">선택 안함</option>
          </select>
        </div>
      </div>

      {/* 저장 버튼 */}
      <button
        className="w-full bg-[#F7C954] text-gray-800 p-4 rounded-2xl mt-12 font-semibold"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "저장 중..." : "저장하기"}
      </button>
    </div>
  );
}
