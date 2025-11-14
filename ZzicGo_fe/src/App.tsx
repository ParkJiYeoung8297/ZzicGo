import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import InstallPromptBanner from "./components/InstallPromptBanner";


import RootLayout from "./layouts/RootLayout";
import LoginLayout from "./layouts/LoginLayout";

// 페이지 컴포넌트들 ...
import NotFoundPage from "./pages/common/NotFoundPage";
import SplashPage from "./pages/common/SplashPage";
import MainPage from "./pages/MainPage";

// 📄 소셜 로그인 관련 컴포넌트
import SocialLoginPage from "./pages/auth/SocialLoginPage";
import NaverCallbackPage from "./pages/auth/NaverCallbackPage";


const router = createBrowserRouter([

  // ✅ 1️⃣ Splash — 첫 진입
  {
    path: "/",
    element: <SplashPage />,
    errorElement: <NotFoundPage />,
    
  },

  // ✅ 2️⃣ 로그인 관련 그룹
  {
    path: "/login",
    element: <LoginLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <SocialLoginPage /> }, // ✅ 처음엔 SplashPage
      { path: "naver/callback", element: <NaverCallbackPage /> },
    ],
  },

    // ✅ 3️⃣ 앱 내부 (로그인 후)
  {
    path: "/main",
    element:  <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/main", element: <MainPage /> },

    ],
  },
]);

export default function App() {
  return <>
    <RouterProvider router={router} />
    <InstallPromptBanner /> {/* ✅ 앱 전체에서 배너 감시 */}
  
  </>
  
}