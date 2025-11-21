import { IoIosNotificationsOutline } from "react-icons/io";
import Calendar from "../components/Calendar";
import { useNavigate, } from "react-router-dom";
import { PATH } from "../constants/paths";
import { useMyChallenges } from "../hooks/useMyChallenges";
import GenericModal from "../components/GeneralModal";
import ChallengeLeaveContent from "../components/challenge/ChallengeLeaveContent";
import { useState, useRef, useEffect} from "react";
import apiClient from "../api/apiClient";
import BottomSheetModal from "../components/GeneralBottomSheetModal";
import CameraSelectSheet from "../components/challenge/CameraSelectSheet";
import { FaCamera } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

export default function MainPage() {
  const navigate = useNavigate();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { myChallenges, loading } = useMyChallenges();
  const [cameraSheetOpen, setCameraSheetOpen] = useState(false);
  const [todayStatus, setTodayStatus] = useState<Record<number, boolean>>({});
  const [todayHistoryId, setTodayHistoryId] = useState<Record<number, number>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

      // alert("챌린지에서 탈퇴했습니다.");
      setSuccessModalOpen(true);
      window.location.reload(); // 또는 상태 관리 방식으로 자체 업데이트
    } catch (err: any) {
      console.error(err);
      alert("탈퇴 중 오류가 발생했습니다.");
      const msg = err.response?.data?.message || "탈퇴 중 오류가 발생했습니다.";
      setErrorMessage(msg);
      setErrorModalOpen(true);  // 🔥 오류 모달
    } finally {
      setOpenModal(false);
    }
  };

    const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChallenge) return;

    navigate("/z1/upload", { state: { image: file, participationId: selectedChallenge.participationId} });
  };

  const [historyToDelete, setHistoryToDelete] = useState<{
    participationId: number;
    historyId: number;
  } | null>(null);




  const openCamera = () => cameraInputRef.current?.click();
  const openGallery = () => galleryInputRef.current?.click();

  // 오늘 인증 했는지 체크 + historyId 저장
  useEffect(() => {
    if (myChallenges.length === 0) return;

    const fetchStatus = async () => {
      for (const c of myChallenges) {
        try {
          const res = await apiClient.get(
            `/api/z1/history/participations/${c.participationId}/today`
          );

          // 백엔드 응답:
          // result: { checked: true/false, historyId: number|null }
          const { checked, historyId } = res.data.result;

          setTodayStatus(prev => ({
            ...prev,
            [c.participationId]: checked,
          }));

          setTodayHistoryId(prev => ({
            ...prev,
            [c.participationId]: historyId ?? null,
          }));

        } catch (err) {
          console.error("오늘 인증 여부 불러오기 실패:", err);
        }
      }
    };

    fetchStatus();
  }, [myChallenges]);





  return (
    <div className="min-h-screen bg-white px-5 pt-5 pb-16">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between mb-4">
        <IoIosNotificationsOutline className="text-3xl text-gray-800" />
        <img
          src="profile_cheetah.png"
          alt="profile"
          className="w-11 h-11 rounded-full border border-gray-200 cursor-pointer"
          onClick={ () => navigate(PATH.Z1_MY_PAGE) }
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

      {/* 성공 모달 */}
      <GenericModal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <div className="p-5 text-center font-semibold text-lg">탈퇴가 완료되었습니다!</div>
      </GenericModal>

      {/* 오류 모달 */}
      <GenericModal open={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
        <div className="p-5 text-center text-red-600">{errorMessage}</div>
      </GenericModal>

      {/* 🔥 인증 삭제 모달 */}
      <GenericModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="p-5 text-center">
          <h2 className="text-lg font-semibold mb-3">오늘 인증을 삭제하시겠습니까?</h2>
          <p className="text-gray-500 mb-6">삭제되면 복구할 수 없습니다.</p>

          <div className="flex gap-3">
            <button
              className="flex-1 py-2 bg-gray-200 rounded-xl text-gray-700"
              onClick={() => setDeleteModalOpen(false)}
            >
              취소
            </button>

            <button
              className="flex-1 py-2 bg-red-500 rounded-xl text-white"
              onClick={async () => {
                if (!historyToDelete) return;

                try {
                  await apiClient.delete(`/api/z1/history/${historyToDelete.historyId}`);

                  // UI 업데이트
                  setTodayStatus(prev => ({
                    ...prev,
                    [historyToDelete.participationId]: false,
                  }));

                  setDeleteModalOpen(false);
                  setHistoryToDelete(null);

                } catch (err) {
                  console.error("삭제 실패:", err);
                  alert("삭제 중 오류가 발생했습니다.");
                }
              }}
            >
              삭제하기
            </button>
          </div>
        </div>
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
                onClick={() =>
                  navigate(PATH.GO_CHALLENGES_ROOM(c.challengeId), {state: { title: c.name },})}
            >
              {/* 왼쪽: 하트 + 이름 */}
              <div className="flex items-center gap-3">
                <span
                  className="text-3xl text-[#834909]"
                  onClick={(e) => {
                    e.stopPropagation();   // 🔥 카드 클릭 이벤트 방지
                    handleSelectChallenge(c); 
                  }}
                >
                  ♥
                </span>
                <span className="font-semibold text-gray-900" >{c.name}</span>
              </div>

            {/* 오른쪽 카메라/체크 버튼 */}
            <button
              className="text-3xl p-2"
              onClick={(e) => {
                e.stopPropagation();

                if (todayStatus[c.participationId]) {
                  // 오늘 인증한 상태 → 삭제 모달 열기
                  setHistoryToDelete({
                    participationId: c.participationId,
                    historyId: todayHistoryId[c.participationId],
                  });
                  setDeleteModalOpen(true);
                } else {
                  // 오늘 인증 안한 상태 → 카메라 BottomSheet 열기
                  setSelectedChallenge(c);
                  setCameraSheetOpen(true);
                }
              }}
            >
              {todayStatus[c.participationId] ? (
                <FaCheckCircle className="text-green-500" size={28} />
              ) : (
                <FaCamera className="text-gray-500" size={28} />
              )}
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
