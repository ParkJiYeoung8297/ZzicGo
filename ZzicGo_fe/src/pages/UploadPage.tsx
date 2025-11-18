import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ImagePicker from "../components/history/ImagePicker";
import { useUploadPost } from "../hooks/useUploadPost";

export default function UploadPage() {
  const { state } = useLocation(); // SelectPhotoPage에서 전달된 이미지
  const [images, setImages] = useState<File[]>([]);
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");

  const { upload } = useUploadPost();

  // 🔥 전달받은 image 추가
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
      const participantId = 12; // 나중에 params로 변경 예정
      await upload(participantId, images, content, visibility);
      alert("업로드 완료!");
    } catch (err) {
      console.error(err);
      alert("업로드 실패");
    }
  };

  return (
    <div className="p-4">
      <ImagePicker images={images} setImages={setImages} />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="메시지를 입력하세요"
        className="border rounded w-full p-2 mt-3"
      />

      <button
        onClick={handleSubmit}
        className="bg-yellow-400 w-full py-3 mt-5 rounded"
      >
        공유
      </button>
    </div>
  );
}
