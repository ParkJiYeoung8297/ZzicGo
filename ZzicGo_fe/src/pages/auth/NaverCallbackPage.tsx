// src/pages/auth/NaverCallbackPage.tsx
import { useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { PATH } from "../../constants/paths";
import Spinner from "../../components/Spinner";

export default function NaverCallbackPage() {
  const navigate = useNavigate();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const doLogin = async () => {

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        if (!code) {
          console.error("네이버 인증 코드가 없습니다.");
          navigate("/login");
          return;
        }

        const res = await apiClient.get(`/api/z1/auth/naver`, {
          params: { code, state },
        });

        const { accessToken, refreshToken, isNewUser } = res.data.result;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        if (isNewUser) {
          navigate(PATH.WELCOME);
          return;
        }

        navigate(PATH.Z1_MAIN);
      } catch (err) {
        console.error("네이버 로그인 실패:", err);
        navigate("/login");
      } finally {
      }
    };

    doLogin();
  }, []);


  return (
    
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <Spinner />
        <p className="text-gray-700 text-base ">      </p>
        <p className="text-gray-700 text-base mt-10">네이버 로그인 처리 중...</p>
      </div>
    </div>
  );
}
