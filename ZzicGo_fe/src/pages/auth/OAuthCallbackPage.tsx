import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { PATH } from "../../constants/paths";
import Spinner from "../../components/Spinner";
import { saveTokens } from "../../utils/authStorage";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { provider } = useParams();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const doLogin = async () => {
      try {

        const allowedProviders = ["naver", "kakao"];

        if (!provider || !allowedProviders.includes(provider)) {
          console.error("지원하지 않는 provider:", provider);
          navigate(PATH.LOGIN);
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        if (!code) {
          console.error("OAuth 인증 코드가 없습니다.");
          navigate(PATH.LOGIN);
          return;
        }

        const params: Record<string, string> = { code };

        if (state) {
          params.state = state;
        }

        const res = await apiClient.get(`/api/z1/auth/${provider}`, {
          params,
        });

        const { accessToken, refreshToken, isNewUser } = res.data.result;
        saveTokens(accessToken, refreshToken);

        if (isNewUser) {
          navigate(PATH.WELCOME);
          return;
        }

        navigate(PATH.Z1_MAIN);
      } catch (err) {
        console.error(`${provider} 로그인 실패:`, err);
        navigate("/login");
      }
    };

    doLogin();
  }, [navigate, provider]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <Spinner />
        <p className="text-gray-700 text-base mt-10">
          {provider?.toUpperCase()} 로그인 처리 중...
        </p>
      </div>
    </div>
  );
}