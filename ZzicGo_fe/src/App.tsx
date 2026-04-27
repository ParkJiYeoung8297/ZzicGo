import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from "react";

import InstallPromptBanner from "./components/InstallPromptBanner"
import AuthExpiredModal from "./components/auth/AuthExpiredModal";

// 경로 상수화
import { PATH } from "./constants/paths";

import RootLayout from "./layouts/RootLayout";
import LoginLayout from "./layouts/LoginLayout";

// 페이지 컴포넌트들 ...
import NotFoundPage from "./pages/common/NotFoundPage";
import SplashPage from "./pages/common/SplashPage";
import NewUserWelcomePage from "./pages/common/NewUserWelcomePage";
import UploadPage from "./pages/UploadPage";
import EditHistoryPage from "./pages/EditHistoryPage";
import MyPage from "./pages/mypage/MyPage";
import EditProfilePage from "./pages/mypage/EditProfilePage";

import MainPage from "./pages/MainPage";
import FindChallengesPage from "./pages/FindChallengesPage";
import ChallengeHistoryRoomPage from "./pages/ChallengeHistoryRoomPage";

// 📄 소셜 로그인 관련 컴포넌트
import SocialLoginPage from "./pages/auth/SocialLoginPage";
import OAuthCallbackPage from "./pages/auth/OAuthCallbackPage";


const queryClient = new QueryClient();
const router = createBrowserRouter([

  // ✅ 1️⃣ Splash — 첫 진입
  {
    path: PATH.SPLASH,
    element: <SplashPage />,
  },

  // ✅ 2️⃣ 로그인 관련 그룹
  {
    path: PATH.LOGIN,
    element: <LoginLayout />,
    children: [
      { index: true, element: <SocialLoginPage /> }, 
      { path: PATH.OAUTH_CALLBACK, element: <OAuthCallbackPage /> },
      
    ],
  },

  { path: PATH.WELCOME, element: <NewUserWelcomePage />, errorElement: <NotFoundPage />, },

    // ✅ 3️⃣ 앱 내부 (로그인 후)
  {
    path: PATH.Z1_ROOT,
    element: <RootLayout />,
    children: [
      { index: true, element: <MainPage /> }, 
      { path: PATH.Z1_CHALLENGES, element: < FindChallengesPage/> },
      { path: PATH.Z1_UPLOAD, element: < UploadPage/> },
      { path: PATH.Z1_HISTORY_EDIT, element: < EditHistoryPage/> },
      { path: PATH.Z1_CHALLENGES_ROOM, element: < ChallengeHistoryRoomPage/> },
      { path: PATH.Z1_MY_PAGE, element: < MyPage/> },
      { path: PATH.Z1_MY_PROFILE_PAGE, element: < EditProfilePage/> },

    ],
  },

  // 4️⃣ NotFound
  { path: "*", element: <NotFoundPage /> },
]);



export default function App() {

  const [authExpired, setAuthExpired] = useState(false);

  useEffect(() => {
    const handler = () => setAuthExpired(true);

    window.addEventListener("auth-expired", handler);

    return () => {
      window.removeEventListener("auth-expired", handler);
    };
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <InstallPromptBanner /> {/* ✅ 앱 전체에서 배너 감시 */}
      </QueryClientProvider>

      <AuthExpiredModal
        open={authExpired}
        onClose={() => setAuthExpired(false)}
      />
    </>
  );
}