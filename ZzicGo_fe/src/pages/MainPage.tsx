import { useEffect, useRef, useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaCamera } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import GenericModal from "../components/GeneralModal";
import BottomSheetModal from "../components/GeneralBottomSheetModal";
import CameraSelectSheet from "../components/challenge/CameraSelectSheet";
import ChallengeLeaveContent from "../components/challenge/ChallengeLeaveContent";
import apiClient from "../api/apiClient";
import type { HistoryItem } from "../api/chat";
import { PATH } from "../constants/paths";
import { useMyChallenges } from "../hooks/useMyChallenges";
import { registerFcmTokenAfterLogin } from "../libs/fcm";

type DailyHistoryItem = HistoryItem & {
  challengeId: number;
  participationId: number;
  challengeName: string;
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isTodayDate(date: Date) {
  return toDateKey(date) === toDateKey(new Date());
}

export default function MainPage() {
  const navigate = useNavigate();
  const { myChallenges, loading } = useMyChallenges();

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cameraSheetOpen, setCameraSheetOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<DailyHistoryItem | null>(null);
  const [selectedHistoryImage, setSelectedHistoryImage] = useState<string | null>(null);

  const [myHistoryMap, setMyHistoryMap] = useState<Record<number, DailyHistoryItem[]>>({});

  const [selectedChallenge, setSelectedChallenge] = useState<{
    participationId: number;
    challengeId: number;
    name: string;
  } | null>(null);

  const [historyToDelete, setHistoryToDelete] = useState<{
    participationId: number;
    historyId: number;
  } | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const openCamera = () => cameraInputRef.current?.click();
  const openGallery = () => galleryInputRef.current?.click();

  const handleSelectChallenge = (challenge: {
    participationId: number;
    challengeId: number;
    name: string;
  }) => {
    setSelectedChallenge({
      participationId: challenge.participationId,
      challengeId: challenge.challengeId,
      name: challenge.name,
    });
    setOpenModal(true);
  };

  const handleLeave = async () => {
    if (!selectedChallenge) return;

    try {
      await apiClient.post(
        `/api/z1/challenges/participations/${selectedChallenge.participationId}/me`
      );

      setSuccessModalOpen(true);
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "탈퇴 중 오류가 발생했습니다.";
      setErrorMessage(msg);
      setErrorModalOpen(true);
    } finally {
      setOpenModal(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChallenge) return;

    navigate("/z1/upload", {
      state: {
        image: file,
        participationId: selectedChallenge.participationId,
      },
    });
  };

  useEffect(() => {
    registerFcmTokenAfterLogin();
  }, []);

  useEffect(() => {
    if (myChallenges.length === 0) {
      setMyHistoryMap({});
      return;
    }

    const fetchMyHistories = async () => {
      setHistoryLoading(true);

      try {
        const historyEntries = await Promise.all(
          myChallenges.map(async (challenge) => {
            let cursor: string | null = null;
            let hasMore = true;
            const histories: DailyHistoryItem[] = [];

            while (hasMore) {
              const res: {
                data: {
                  result: {
                    histories: HistoryItem[];
                    nextCursor: string | null;
                    hasMore: boolean;
                  };
                };
              } = await apiClient.get(
                `/api/z1/challenges/${challenge.challengeId}/histories`,
                {
                  params: {
                    visibility: "PRIVATE",
                    cursor: cursor ?? "",
                    size: 100,
                  },
                }
              );

              const result: {
                histories: HistoryItem[];
                nextCursor: string | null;
                hasMore: boolean;
              } = res.data.result;

              histories.push(
                ...(result.histories as HistoryItem[]).map((history) => ({
                  ...history,
                  challengeId: challenge.challengeId,
                  participationId: challenge.participationId,
                  challengeName: challenge.name,
                }))
              );

              cursor = result.nextCursor;
              hasMore = result.hasMore;
            }

            return [challenge.participationId, histories] as const;
          })
        );

        setMyHistoryMap(Object.fromEntries(historyEntries));
      } catch (err) {
        console.error("내 인증 기록 불러오기 실패:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchMyHistories();
  }, [myChallenges]);

  const highlightedDates = Array.from(
    new Set(
      Object.values(myHistoryMap)
        .flat()
        .map((history) => toDateKey(new Date(history.createdAt)))
    )
  );

  const selectedDateKey = toDateKey(selectedDate);
  const isTodaySelected = isTodayDate(selectedDate);
  const selectedDateHistories = Object.values(myHistoryMap)
    .flat()
    .filter((history) => toDateKey(new Date(history.createdAt)) === selectedDateKey)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const selectedDateHistoryMap = Object.values(myHistoryMap)
    .flat()
    .reduce<Record<number, DailyHistoryItem>>((acc, history) => {
      if (toDateKey(new Date(history.createdAt)) === selectedDateKey) {
        acc[history.participationId] = history;
      }
      return acc;
    }, {});

  const handleDeleteHistory = async (history: {
    participationId: number;
    historyId: number;
  }) => {
    try {
      await apiClient.delete(`/api/z1/history/${history.historyId}`);
      setMyHistoryMap((prev) => ({
        ...prev,
        [history.participationId]: (prev[history.participationId] ?? []).filter(
          (item) => item.historyId !== history.historyId
        ),
      }));

      setDeleteModalOpen(false);
      setHistoryToDelete(null);
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const openEditPage = (history: DailyHistoryItem) => {
    navigate(PATH.GO_HISTORY_EDIT(history.historyId), {
      state: {
        history,
        challengeId: history.challengeId,
        title: history.challengeName,
      },
    });
  };

  const openHistoryDetail = (history: DailyHistoryItem, imageUrl?: string) => {
    setSelectedHistory(history);
    setSelectedHistoryImage(imageUrl ?? history.images[0] ?? null);
  };

  return (
    <div className="min-h-screen bg-white px-5 pt-5 pb-16">
      <header className="mb-4 flex items-center justify-between">
        <IoIosNotificationsOutline className="text-3xl text-gray-800" />
        <img
          src="profile_cheetah.png"
          alt="profile"
          className="h-11 w-11 cursor-pointer rounded-full border border-gray-200"
          onClick={() => navigate(PATH.Z1_MY_PAGE)}
        />
      </header>

      <h1 className="mb-4 text-2xl font-bold text-gray-900">나의 챌린지</h1>

      <Calendar
        highlightedDates={highlightedDates}
        onSelectDate={setSelectedDate}
      />

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 기록
          </h2>
          {historyLoading && (
            <span className="text-sm text-gray-400">불러오는 중...</span>
          )}
        </div>

        {selectedDateHistories.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {selectedDateHistories.map((history) => (
              <button
                key={history.historyId}
                type="button"
                className="group relative aspect-square overflow-hidden rounded-2xl bg-[#FFF9ED]"
                onClick={() => openHistoryDetail(history)}
              >
                {history.images[0] ? (
                  <img
                    src={history.images[0]}
                    alt=""
                    className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#FFF1CC] p-3 text-center text-xs text-gray-500">
                    사진 없는 기록
                  </div>
                )}

                {history.images.length > 1 && (
                  <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">
                    +{history.images.length - 1}
                  </span>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-3 text-left">
                  <p className="truncate text-xs font-semibold text-white">
                    {history.challengeName}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          !historyLoading && (
            <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-400">
              선택한 날짜에 남긴 인증 기록이 없어요
            </div>
          )
        )}
      </section>

      <GenericModal open={openModal} onClose={() => setOpenModal(false)}>
        <ChallengeLeaveContent
          challengeName={selectedChallenge?.name || ""}
          onClose={() => setOpenModal(false)}
          onConfirm={handleLeave}
        />
      </GenericModal>

      <GenericModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
      >
        <div className="p-5 text-center text-lg font-semibold">
          탈퇴가 완료되었습니다!
        </div>
      </GenericModal>

      <GenericModal open={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
        <div className="p-5 text-center text-red-600">{errorMessage}</div>
      </GenericModal>

      <GenericModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="p-5 text-center">
          <h2 className="mb-3 text-lg font-semibold">
            인증 기록을 삭제하시겠습니까?
          </h2>
          <p className="mb-6 text-gray-500">삭제되면 복구할 수 없습니다.</p>

          <div className="flex gap-3">
            <button
              className="flex-1 rounded-xl bg-gray-200 py-2 text-gray-700"
              onClick={() => setDeleteModalOpen(false)}
            >
              취소
            </button>

            <button
              className="flex-1 rounded-xl bg-red-500 py-2 text-white"
              onClick={async () => {
                if (!historyToDelete) return;
                await handleDeleteHistory(historyToDelete);
              }}
            >
              삭제하기
            </button>
          </div>
        </div>
      </GenericModal>

      {selectedHistory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => {
            setSelectedHistory(null);
            setSelectedHistoryImage(null);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black">
              {selectedHistoryImage ? (
                <img
                  src={selectedHistoryImage}
                  alt=""
                  className="h-[360px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[360px] items-center justify-center text-sm text-white/70">
                  사진이 없습니다
                </div>
              )}
            </div>

            {selectedHistory.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto bg-[#FFF9ED] px-4 py-3">
                {selectedHistory.images.map((imageUrl, index) => (
                  <button
                    key={`${selectedHistory.historyId}-${index}`}
                    type="button"
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 ${
                      selectedHistoryImage === imageUrl
                        ? "border-[#F7C954]"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedHistoryImage(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-3 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedHistory.challengeName}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(selectedHistory.createdAt).toLocaleString("ko-KR")}
                  </p>
                </div>
                <span className="rounded-full bg-[#FFF4D6] px-3 py-1 text-xs font-medium text-[#8A5A00]">
                  {selectedHistory.visibility === "PUBLIC" ? "공개" : "나만 보기"}
                </span>
              </div>

              {selectedHistory.content && (
                <p className="text-sm leading-relaxed text-gray-700">
                  {selectedHistory.content}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  className="flex-1 rounded-full bg-[#F7C954] px-4 py-3 text-sm font-semibold text-gray-800"
                  onClick={() => {
                    openEditPage(selectedHistory);
                    setSelectedHistory(null);
                    setSelectedHistoryImage(null);
                  }}
                >
                  수정
                </button>
                <button
                  className="flex-1 rounded-full bg-[#FDEBEC] px-4 py-3 text-sm font-semibold text-red-500"
                  onClick={() => {
                    setHistoryToDelete({
                      participationId: selectedHistory.participationId,
                      historyId: selectedHistory.historyId,
                    });
                    setDeleteModalOpen(true);
                    setSelectedHistory(null);
                    setSelectedHistoryImage(null);
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomSheetModal
        open={cameraSheetOpen}
        onClose={() => setCameraSheetOpen(false)}
      >
        <CameraSelectSheet
          onCamera={() => {
            setCameraSheetOpen(false);
            openCamera();
          }}
          onGallery={() => {
            setCameraSheetOpen(false);
            openGallery();
          }}
        />
      </BottomSheetModal>

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

      {loading && (
        <div className="mt-10 text-center text-gray-400">불러오는 중...</div>
      )}

      {!loading && myChallenges.length > 0 && (
        <div className="mt-6 space-y-3">
          {myChallenges.map((challenge) => (
            <div
              key={challenge.participationId}
              className="flex cursor-pointer items-center justify-between rounded-xl border bg-white px-4 py-3 shadow"
              onClick={() =>
                navigate(PATH.GO_CHALLENGES_ROOM(challenge.challengeId), {
                  state: { title: challenge.name },
                })
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-3xl text-[#834909]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectChallenge(challenge);
                  }}
                >
                  ♥
                </span>
                <span className="font-semibold text-gray-900">
                  {challenge.name}
                </span>
              </div>

              {selectedDateHistoryMap[challenge.participationId] ? (
                <FaCheckCircle className="text-green-500" size={28} />
              ) : (
                <>
                  {isTodaySelected ? (
                    <button
                      className="p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedChallenge(challenge);
                        setCameraSheetOpen(true);
                      }}
                    >
                      <FaCamera className="text-gray-500" size={28} />
                    </button>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-400">
                      기록 없음
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && myChallenges.length === 0 && (
        <div className="mt-10 text-center text-gray-500">
          아직 참여 중인 챌린지가 없어요
        </div>
      )}

      <div className="mt-12 text-center">
        <button
          className="text-lg font-semibold text-gray-700 underline"
          onClick={() => navigate(PATH.Z1_CHALLENGES)}
        >
          + 챌린지 추가
        </button>
      </div>
    </div>
  );
}
