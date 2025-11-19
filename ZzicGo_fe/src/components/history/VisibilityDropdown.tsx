import { useState } from "react";

type Props = {
  visibility: "PUBLIC" | "PRIVATE";
  setVisibility: (v: "PUBLIC" | "PRIVATE") => void;
};

export default function VisibilityDropdown({ visibility, setVisibility }: Props) {
  const [open, setOpen] = useState(false);

  const handleChange = (value: "PUBLIC" | "PRIVATE") => {
    setVisibility(value);
    setOpen(false); // 닫기
  };

  return (
    <div className="relative">
      {/* 버튼 */}
      <button
        className="bg-yellow-400 px-3 py-1 rounded-md shadow font-semibold flex items-center gap-1"
        onClick={() => setOpen((prev) => !(prev))}
      >
        {visibility === "PUBLIC" ? "공개" : "나만보기"}
        <span className="text-sm">▼</span>
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div className="absolute right-0 mt-2 bg-[#F0E3B8] rounded-lg shadow-lg w-32 py-1 z-50">
          <button
            className={`w-full text-left px-3 py-2 rounded hover:bg-yellow-300 ${
              visibility === "PUBLIC" ? "bg-yellow-300 font-bold" : ""
            }`}
            onClick={() => handleChange("PUBLIC")}
          >
            공개
          </button>

          <button
            className={`w-full text-left px-3 py-2 rounded hover:bg-yellow-300 ${
              visibility === "PRIVATE" ? "bg-yellow-300 font-bold" : ""
            }`}
            onClick={() => handleChange("PRIVATE")}
          >
            나만보기
          </button>
        </div>
      )}
    </div>
  );
}
