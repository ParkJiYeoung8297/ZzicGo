import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { IoChevronBack } from "react-icons/io5";
import apiClient from "../api/apiClient";
import Spinner from "../components/Spinner";
import type { ApiResponse, GetHistoryResponse, HistoryItem } from "../api/chat";

type LocationState = {
  history?: HistoryItem;
  challengeId?: number;
  title?: string;
};

type EditableExistingImage = {
  key: string;
  imageId?: number;
  imageUrl: string;
};

function isRenderableImageUrl(value: string) {
  return /^(https?:\/\/|blob:|data:|\/)/.test(value);
}

export default function EditHistoryPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { historyId } = useParams();
  const { state } = useLocation() as { state: LocationState | null };
  const history = state?.history;
  const challengeId = state?.challengeId;
  const [detailLoading, setDetailLoading] = useState(false);

  const [content, setContent] = useState(history?.content ?? "");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">(
    history?.visibility ?? "PUBLIC"
  );
  const [originalImageIds, setOriginalImageIds] = useState<number[]>(
    history?.imageDetails
      ?.map((image) => image.imageId)
      .filter((imageId): imageId is number => typeof imageId === "number") ?? []
  );
  const [existingImages, setExistingImages] = useState<EditableExistingImage[]>(
    history?.imageDetails?.map((image, index) => ({
      key: `image-${image.imageId ?? index}`,
      imageId: image.imageId,
      imageUrl: image.imageUrl,
    })) ??
      history?.images?.map((imageUrl, index) => ({
        key: `existing-${index}`,
        imageUrl,
      })) ??
      []
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const canDeleteExistingImages = existingImages.some(
    (image) => typeof image.imageId === "number"
  );

  const totalImageCount = existingImages.length + newImages.length;

  const previewUrls = useMemo(
    () => newImages.map((file) => URL.createObjectURL(file)),
    [newImages]
  );

  useEffect(() => {
    if (!historyId) return;

    const fetchHistoryDetail = async () => {
      setDetailLoading(true);

      try {
        const res = await apiClient.get<ApiResponse<GetHistoryResponse>>(
          `/api/z1/history/${historyId}`
        );
        const detail = res.data.result;

        setContent(detail.content ?? history?.content ?? "");
        setVisibility(
          detail.visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC"
        );
        setOriginalImageIds(
          detail.images
            ?.map((image) => image.imageId)
            .filter((imageId): imageId is number => typeof imageId === "number") ??
            []
        );
        setExistingImages(
          detail.images?.map((image, index) => ({
            key: `image-${image.imageId ?? index}`,
            imageId: image.imageId,
            imageUrl:
              isRenderableImageUrl(image.imageUrl)
                ? image.imageUrl
                : history?.images?.[index] ?? image.imageUrl,
          })) ??
            []
        );
      } catch (err) {
        console.error("인증글 상세 조회 실패:", err);
      } finally {
        setDetailLoading(false);
      }
    };

    fetchHistoryDetail();
  }, [history?.content, history?.visibility, historyId]);

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selectedFiles = Array.from(files);

    if (totalImageCount + selectedFiles.length > 3) {
      alert("최대 3장까지 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    setNewImages((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!historyId) return;

    setLoading(true);

    try {
      const originalImageIdSet = new Set(originalImageIds);
      const remainingImageIds = new Set(
        existingImages
          .map((image) => image.imageId)
          .filter((imageId): imageId is number => typeof imageId === "number")
      );
      const deleteImageIds = Array.from(originalImageIdSet).filter(
        (imageId) => !remainingImageIds.has(imageId)
      );

      const formData = new FormData();
      newImages.forEach((image) => formData.append("images", image));
      if (deleteImageIds.length > 0) {
        formData.append(
          "deleteImageIds",
          new Blob([JSON.stringify(deleteImageIds)], {
            type: "application/json",
          })
        );
      }
      formData.append(
        "content",
        new Blob([content], { type: "application/json" })
      );
      formData.append(
        "visibility",
        new Blob([visibility], { type: "application/json" })
      );

      await apiClient.patch(`/api/z1/history/${historyId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (challengeId) {
        await queryClient.invalidateQueries({
          queryKey: ["challengeHistory", challengeId],
        });
      }

      navigate(-1);
    } catch (err: any) {
      console.error("인증글 수정 실패:", err);
      alert(err.response?.data?.message || "인증글 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!history && !detailLoading && existingImages.length === 0 && !historyId) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-4 py-8">
        <button onClick={() => navigate(-1)} className="mb-4 text-2xl text-gray-800">
          <IoChevronBack />
        </button>
        <p className="text-gray-500">수정할 인증글 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3">
        {(loading || detailLoading) && <Spinner />}
        <button onClick={() => navigate(-1)}>
          <IoChevronBack className="text-2xl text-gray-800" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">인증글 수정</h1>
      </div>

      <div className="flex-1 px-4 pb-8">
        <div className="rounded-2xl border border-[#EDB043] bg-[#FFF8EB] p-3">
          <div className="grid grid-cols-3 gap-3">
            {existingImages.map((image) => (
              <div
                key={image.key}
                className="relative aspect-square overflow-hidden rounded-xl"
              >
                <img
                  src={image.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {canDeleteExistingImages && (
                  <button
                    type="button"
                    className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white"
                    onClick={() =>
                      setExistingImages((prev) =>
                        prev.filter((item) => item.key !== image.key)
                      )
                    }
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}

            {previewUrls.map((previewUrl, index) => (
              <div
                key={`${previewUrl}-${index}`}
                className="relative aspect-square overflow-hidden rounded-xl"
              >
                <img
                  src={previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white"
                  onClick={() =>
                    setNewImages((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  삭제
                </button>
              </div>
            ))}

            {totalImageCount < 3 && (
              <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl bg-gray-100 text-3xl text-gray-500">
                +
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleNewImages}
                />
              </label>
            )}
          </div>
        </div>

        {!canDeleteExistingImages && existingImages.length > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            기존 이미지 정보를 불러오는 중이거나 응답 형식이 맞지 않아 일부 사진 수정이 제한될 수 있습니다.
          </p>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="메시지를 입력하세요(선택)"
          className="mt-4 w-full rounded-xl border border-[#EDB043] p-4 text-gray-800 placeholder:text-gray-400 focus:outline-none"
          rows={3}
        />

        <div className="mt-4 rounded-2xl border border-[#EDB043] bg-[#FFF8EB] p-4">
          <div className="flex items-center">
            <p className="text-sm text-gray-500">공개범위</p>

            <div className="ml-auto flex items-center gap-2">
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

        <button
          onClick={handleSubmit}
          className="mt-6 w-full rounded-2xl bg-[#F4C542] py-4 text-lg font-semibold text-gray-800"
          disabled={loading}
        >
          {loading ? "수정 중..." : "수정 완료"}
        </button>
      </div>
    </div>
  );
}
