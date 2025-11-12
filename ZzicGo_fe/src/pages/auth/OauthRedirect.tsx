import { useEffect } from "react";

export default function OauthRedirect() {
  useEffect(() => {
    // 예시: OAuth redirect 처리 로직
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    console.log("OAuth Redirect Code:", code);
    console.log("State:", state);

    // 이후 백엔드로 code 전송 로직 작성 예정
  }, []);

  return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-semibold mb-2">Redirecting...</h2>
      <p className="text-gray-600">Processing your login...</p>
    </div>
  );
}
