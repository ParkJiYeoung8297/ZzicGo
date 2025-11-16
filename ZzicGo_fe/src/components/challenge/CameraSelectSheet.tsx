import { IoCameraOutline } from "react-icons/io5";
import { IoImageOutline } from "react-icons/io5";

interface Props {
  onCamera: () => void;
  onGallery: () => void;
}

export default function CameraSelectSheet({ onCamera, onGallery }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">제품 검색하기</h2>

      {/* 카메라로 촬영하기 */}
      <button
        className="w-full flex items-center gap-4 py-4"
        onClick={onCamera}
      >
        <div className="bg-gray-100 p-4 rounded-full">
          <IoCameraOutline className="text-2xl text-gray-700" />
        </div>
        <span className="text-lg">카메라로 촬영하기</span>
      </button>

      <div className="border-t my-2" />

      {/* 사진 앨범에서 선택하기 */}
      <button
        className="w-full flex items-center gap-4 py-4"
        onClick={onGallery}
      >
        <div className="bg-gray-100 p-4 rounded-full">
          <IoImageOutline className="text-2xl text-gray-700" />
        </div>
        <span className="text-lg">사진 앨범에서 선택하기</span>
      </button>
    </div>
  );
}
