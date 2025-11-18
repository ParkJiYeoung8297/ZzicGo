import axios from "axios";

export const useUploadPost = () => {
  const upload = async (participantId: number, images, content, visibility) => {
    const formData = new FormData();

    images.forEach((img) => {
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
