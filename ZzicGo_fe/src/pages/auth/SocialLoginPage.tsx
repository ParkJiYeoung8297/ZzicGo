// src/pages/auth/SocialLoginPage.tsx
import { useSocialLogin } from "../../hooks/useSocialLogin";
import SocialButton from "../../components/auth/SocialButton";
import { SiNaver} from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";


export default function SocialLoginPage() {
  const { handleSocialLogin } = useSocialLogin();

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center px-8">

      {/* 헤더 */}
      <div className="w-full max-w-sm flex flex-col gap-4 mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">오늘 하루</h2>
        <h1 className="text-4xl font-extrabold text-black">ZzicGo</h1>
      </div>

      {/* 버튼 영역 */}
      <div className="w-full max-w-sm flex flex-col gap-4 font-semibold">
        <SocialButton
          provider="naver"
          text="네이버로 시작하기"
          bgColor="bg-[#03C75A] hover:bg-[#02b550]"
          textColor="text-white"
          icon={<SiNaver />}
          onClick={() => handleSocialLogin("naver")}
        />

        <SocialButton
          provider="kakao"
          text="카카오로 시작하기"
          bgColor="bg-[#FEE500] hover:bg-[#fada00]"
          icon={<RiKakaoTalkFill className="text-2xl" />}
          onClick={() => handleSocialLogin("kakao")}
        />

        <SocialButton
          provider="google"
          text="Google로 시작하기"
          bgColor="bg-white hover:bg-gray-50"
          border="border border-gray-300"
          icon={<FcGoogle />}
          onClick={() => handleSocialLogin("google")}
        />
      </div>
    </div>
  );
}