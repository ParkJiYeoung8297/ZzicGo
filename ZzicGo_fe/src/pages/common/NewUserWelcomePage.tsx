import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/paths";

export default function NewUserWelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-6">
      <img
        src="cheetah_camera.png"
        alt="welcome"
        className="w-48 h-48 mb-8"
      />

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        회원가입 완료!
      </h2>

      <p className="text-gray-600 text-center mb-10">
        여러분의 챌린지를 시작해주세요 🙌
      </p>

      <button
        onClick={() => navigate(PATH.Z1_MAIN)}
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold 
                   px-10 py-3 rounded-xl shadow-md active:scale-95 transition"
      >
        ZzicGo 시작하기
      </button>

      <div className="h-10" />
    </div>
  );
}
