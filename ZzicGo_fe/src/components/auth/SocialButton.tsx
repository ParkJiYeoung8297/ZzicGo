// src/components/auth/SocialButton.tsx
import React from "react";

interface SocialButtonProps {
  provider: "naver" | "kakao" | "google";
  text: string;
  bgColor: string;
  textColor?: string;
  border?: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

export default function SocialButton({
  text,
  bgColor,
  textColor = "text-black",
  border = "",
  icon,
  onClick,
}: SocialButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 py-3 rounded-full ${bgColor} ${textColor} ${border} text-m shadow-sm transition active:scale-[0.98]`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {text}
    </button>
  );
}
