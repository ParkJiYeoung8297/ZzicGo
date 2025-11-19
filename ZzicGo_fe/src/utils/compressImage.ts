export const compressImage = (file: File, maxWidth = 1080, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // 1) 리사이징: 너비 기준으로 1080px 이하로 줄이기 (화질 크게 안 떨어짐)
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("canvas context error");

      ctx.drawImage(img, 0, 0, width, height);

      // 2) JPEG 품질 0.8 (눈으로 티 거의 안 나면서 용량 50~70% 감소)
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Blob conversion failed");

          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = reject;
  });
};
