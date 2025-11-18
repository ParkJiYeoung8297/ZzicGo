import { useRef } from "react";

export default function ImagePicker({ images, setImages }) {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 3) {
      alert("최대 3장까지 업로드할 수 있습니다.");
      return;
    }

    const newImages = [...images, ...Array.from(files)];
    setImages(newImages);
  };

  return (
    <div className="flex gap-2">
      {images.map((file, index) => (
        <img
          key={index}
          src={URL.createObjectURL(file)}
          className="w-24 h-24 object-cover rounded"
        />
      ))}

      {images.length < 3 && (
        <div
          className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center cursor-pointer"
          onClick={() => fileInput.current?.click()}
        >
          +
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            ref={fileInput}
            onChange={handleSelect}
          />
        </div>
      )}
    </div>
  );
}
