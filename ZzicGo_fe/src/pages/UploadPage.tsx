import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ImagePicker from "../components/history/ImagePicker";
import { useUploadPost } from "../hooks/useUploadPost";
import { IoChevronBack } from "react-icons/io5";
import { PATH } from "../constants/paths";

export default function UploadPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [images, setImages] = useState<File[]>([]);
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");

  const { upload } = useUploadPost();
  const participationId = state?.participationId;

  // 🔥 SelectPhoto에서 전달된 이미지 반영
  useEffect(() => {
    if (state?.image) {
      setImages([state.image]);
    }
  }, [state]);

  const handleSubmit = async () => {
    if (images.length === 0) {
      alert("사진을 최소 1장 업로드해주세요.");
      return;
    }

    try {
      
      await upload(participationId, images, content, visibility);
      alert("업로드 완료!");
    } catch (error: any) {
      alert(error.response?.data?.message || "업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* 🔙 상단 헤더 */}
      <div className="flex items-center gap-2 px-4 py-3">
        <button onClick={() => navigate(PATH.Z1_MAIN)}>
          <IoChevronBack className="text-2xl text-gray-800" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">사진 업로드</h1>
      </div>

      {/* 전체 컨텐츠 */}
      <div className="flex-1 px-4">
        {/* 📸 이미지 박스 */}
        <div className="aspect-[3.5] bg-[#FFF8EB] border border-[#EDB043] rounded-2xl p-3">
          <ImagePicker images={images} setImages={setImages} />
        </div>

        {/* 📝 메시지 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="w-full mt-4 border border-[#EDB043] rounded-xl p-4 text-gray-800 placeholder:text-gray-400 focus:outline-none"
          rows={3}
        />

        {/* 👀 공개범위 */}
        <div className="mt-4 bg-[#FFF8EB] border border-[#EDB043] rounded-2xl p-4">
          <div className="flex items-center">
            {/* 왼쪽 텍스트 */}
            <p className="text-gray-500 text-sm">공개범위</p>

            {/* 오른쪽 버튼 그룹 */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  visibility === "PUBLIC"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setVisibility("PUBLIC")}
              >
                공개
              </button>

              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  visibility === "PRIVATE"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setVisibility("PRIVATE")}
              >
                나만 보기
              </button>
            </div>
          </div>
        </div>



        {/* 🟡 공유 버튼 */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-[#F4C542] py-4 rounded-2xl text-lg font-semibold text-gray-800"
        >
          공유
        </button>
      </div>
    </div>
  );
}
