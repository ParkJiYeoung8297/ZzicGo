import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SocialCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    console.log("OAuth Callback Code:", code);
    console.log("State:", state);

    // ✅ 실제 구현 시: 백엔드에 code 보내서 JWT 발급받기
    // fetch("/api/auth/naver", { method: "POST", body: JSON.stringify({ code, state }) })

    setTimeout(() => navigate("/"), 2000); // 2초 후 메인으로 이동
  }, [navigate]);

  return (
    <div className="text-center mt-20">
      <h2 className="text-xl font-semibold mb-2">Social Login Success 🎉</h2>
      <p className="text-gray-600">Redirecting to home...</p>
    </div>
  );
}
