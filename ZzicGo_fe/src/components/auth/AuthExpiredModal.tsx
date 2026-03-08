import GeneralModal from "../GeneralModal";
import { clearTokens } from "../../utils/authStorage";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthExpiredModal({ open, onClose }: Props) {
  const handleLogin = () => {
    clearTokens();
    window.location.href = "/login";
  };

  return (
    <GeneralModal open={open} onClose={onClose}>
      <div className="flex flex-col items-center gap-4 text-center">

        <h2 className="text-lg font-semibold text-gray-800">
          로그인이 필요합니다
        </h2>

        <p className="text-sm text-gray-500">
          서비스를 이용하려면 다시 로그인해주세요.
        </p>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
        >
          로그인하기
        </button>

      </div>
    </GeneralModal>
  );
}