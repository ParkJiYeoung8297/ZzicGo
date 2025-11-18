import axios from "axios";

export const useUploadPost = () => {
    const upload = async (
    participantId: number,
    images: File[],          // 타입 추가
    content: string,         // 타입 추가
    visibility: "PUBLIC" | "PRIVATE"  // 타입 추가
  ) => {
    const formData = new FormData();

    images.forEach((img: File) => {
      formData.append("images", img);
    });

    formData.append("content", content ?? "");
    formData.append("visibility", visibility);

    const res = await axios.post(
      `/api/z1/posts/${participantId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return res.data;
  };

  return { upload };
};
