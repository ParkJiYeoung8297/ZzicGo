import { IoIosNotificationsOutline } from "react-icons/io";
import Calendar from "../components/Calendar";
import { useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { useMyChallenges } from "../hooks/useMyChallenges";
import GenericModal from "../components/GeneralModal";
import ChallengeLeaveContent from "../components/challenge/ChallengeLeaveContent";
import { useState, useRef } from "react";
import apiClient from "../api/apiClient";
import BottomSheetModal from "../components/GeneralBottomSheetModal";
import CameraSelectSheet from "../components/challenge/CameraSelectSheet";

export default function MainPage() {
  const navigate = useNavigate();
  const { myChallenges, loading } = useMyChallenges();
  const [cameraSheetOpen, setCameraSheetOpen] = useState(false);

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

    const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    navigate("/z1/upload", { state: { image: file } });
  };

  const openCamera = () => cameraInputRef.current?.click();
  const openGallery = () => galleryInputRef.current?.click();


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

      {/* 카메라 선택 BottomSheet */}
      <BottomSheetModal
        open={cameraSheetOpen}
        onClose={() => setCameraSheetOpen(false)}
      >
        <CameraSelectSheet
          onCamera={() => {
            setCameraSheetOpen(false);
            openCamera();  // 📸 바로 실행
          }}
          onGallery={() => {
            setCameraSheetOpen(false);
            openGallery(); // 🖼 바로 실행
          }}
        />
      </BottomSheetModal>

      {/* 실제 input은 화면에 보이지 않음 */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFileChange}
      />

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />


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
              className="bg-white rounded-xl px-4 py-3 shadow border flex items-center justify-between cursor-pointer"
              onClick={() => handleSelectChallenge(c)}   // 🔥 챌린지 클릭 → 탈퇴 팝업
            >
              {/* 왼쪽: 하트 + 이름 */}
              <div className="flex items-center gap-2">
                <span className="text-2xl text-yellow-700">♡</span>
                <span className="font-semibold text-gray-900">{c.name}</span>
              </div>

              {/* 오른쪽 카메라 버튼 */}
              <button
                className="text-2xl"
                onClick={(e) => {
                  e.stopPropagation(); // ❗ 탈퇴 팝업 안 뜨도록 방지
                  setCameraSheetOpen(true);
                }}
              >
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#666666">
                    <path d="M440-440ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l74-80h240v80H355l-73 80H120v480h640v-360h80v360q0 33-23.5 56.5T760-120H120Zm640-560v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Z"/>
                  </svg>
                </div>

              </button>
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
