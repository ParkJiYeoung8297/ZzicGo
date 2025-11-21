import apiClient from "../api/apiClient";
import { compressImage } from "../utils/compressImage";

export const useUploadPost = () => {
    const upload = async (
    participantId: number,
    images: File[],          // 타입 추가
    content: string,         // 타입 추가
    visibility: "PUBLIC" | "PRIVATE"  // 타입 추가
  ) => {
    const formData = new FormData();

    // 🔥 이미지 압축 처리
    for (const img of images) {
      const compressed = await compressImage(img, 1080, 0.8);
      formData.append("images", compressed);
    }

    formData.append("content", content ?? "");
    formData.append("visibility", visibility);


    try{
          const res = await apiClient.post(
      `/api/z1/history/${participantId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return res.data;

    }catch(error: any){
      throw error;
    }

  };

  return { upload };
};
