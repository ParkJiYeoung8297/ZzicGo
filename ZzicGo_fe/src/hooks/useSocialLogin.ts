// src/hooks/useSocialLogin.ts
export function useSocialLogin() {
  const handleSocialLogin = (provider: "naver" | "kakao" | "google") => {
    switch (provider) {
      case "naver":{
        const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_NAVER_REDIRECT_URI;
        const state = Math.random().toString(36).substring(2, 15);
        const naverUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`;
        console.log("redirectUri: ", import.meta.env.VITE_NAVER_REDIRECT_URI);
        window.location.href = naverUrl;
        break;


      }

      case "kakao":
        window.location.href = "https://kauth.kakao.com/oauth/authorize";
        break;
      case "google":
        window.location.href = "https://accounts.google.com/o/oauth2/v2/auth";
        break;
      default:
        console.warn("Unknown provider");
    }
  };

  return { handleSocialLogin };
}
