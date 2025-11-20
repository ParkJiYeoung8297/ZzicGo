// src/components/UserAvatar.tsx
import { FiCamera } from "react-icons/fi";

interface Props {
  size?: number;
}

export default function UserAvatar({ size = 90 }: Props) {
  return (
    <div className="relative w-fit mx-auto">
      <img
        src="/profile_cheetah.png" 
        alt="avatar"
        className="rounded-full"
        style={{ width: size, height: size }}
      />
      <div className="absolute bottom-1 right-1 bg-yellow-400 p-1 rounded-full shadow">
        <FiCamera size={16} />
      </div>
    </div>
  );
}
