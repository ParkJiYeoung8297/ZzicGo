import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../utils/authStorage";
import { PATH } from "../../constants/paths";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAccessToken();
    const timer = setTimeout(() => {
      if (token) {
        navigate(PATH.Z1_ROOT); // 자동 로그인
      } else {
        navigate(PATH.LOGIN); // 로그인 페이지
      }
    }, 4000); // 스플래시 영상 길이
    return () => clearTimeout(timer);
  }, [navigate]);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-white overflow-hidden ">
       <div className="w-[70vw] h-[70vh] flex items-center justify-center">
        <video
          src="/splash.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          className="max-w-sm w-[70vw] max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
}
