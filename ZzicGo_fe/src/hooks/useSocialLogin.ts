// src/hooks/useSocialLogin.ts
export function useSocialLogin() {
  const handleSocialLogin = (provider: "naver" | "kakao" | "google") => {
    switch (provider) {
      case "naver":
        window.location.href = "https://nid.naver.com/oauth2.0/authorize";
        break;
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
