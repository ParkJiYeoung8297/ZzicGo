// src/components/InfoRow.tsx
import { FiChevronRight } from "react-icons/fi";

interface Props {
  title: string;
  onClick?: () => void;
}

export default function InfoRow({ title, onClick }: Props) {
  return (
    <div
      className="flex items-center justify-between py-4 border-b cursor-pointer"
      onClick={onClick}
    >
      <span className="text-gray-800">{title}</span>
      <FiChevronRight />
    </div>
  );
}
