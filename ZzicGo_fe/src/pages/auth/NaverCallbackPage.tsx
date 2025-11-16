// src/pages/auth/NaverCallbackPage.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { PATH } from "../../constants/paths";

export default function NaverCallbackPage() {
  const navigate = useNavigate();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    // URL에서 code, state 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (!code) {
      console.error("네이버 인증 코드가 없습니다.");
      return;
    }

    // 백엔드에 로그인 완료 요청
    apiClient
      .get(`/api/z1/auth/naver`, {
        params: { code, state },
      })
      .then((res) => {
        const { accessToken, refreshToken, isNewUser } = res.data.result;

        // JWT 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // 신규 회원이면 환영페이지나, 팝업 띄우기
        if (isNewUser) {
          navigate(PATH.WELCOME);
        } 

        navigate(PATH.Z1_MAIN);

      })
      .catch((err) => {
        console.error("네이버 로그인 실패:", err);
        navigate("/login");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      네이버 로그인 처리 중...
    </div>
  );
}
