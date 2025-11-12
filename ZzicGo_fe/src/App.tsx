import "./index.css";
// import { useEffect, useState } from "react";
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
import OauthRedirect from "./pages/auth/OauthRedirect";
import SocialCallback from "./pages/auth/SocialCallback";
// import SocialSignupForm from "./pages/auth/SocialSignupForm";
// import SocialSignupDetailPage from "./pages/auth/SocialSignupDetailPage";


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
      // { index: true, element: <SplashPage /> }, // ✅ 처음엔 SplashPage
      { path: "oauth-redirect", element: <OauthRedirect /> },
      { path: "oauth/callback", element: <SocialCallback /> },
      { path: "oauth2/code/:provider", element: <SocialCallback /> },
    ],
  },

    // ✅ 3️⃣ 앱 내부 (로그인 후)
  {
    path: "/",
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



// import { useState, useEffect } from 'react';
// import apiClient from './api/axios';
// import './App.css'

// function App() {
//   const [message, setMessage] = useState<string>('');

//   useEffect(() => {
//     apiClient
//     .get<string>('/api/z1/test')
//     .then((res) => {
//       console.log('✅ 서버 응답:', res.data);
//       setMessage(res.data);

//     })
//     .catch((err) => {
//       console.error('❌요청 실패:',err)
//     });
//   }, []);



//   return (
//     <div>
//       <h1>React + Spring 연결 테스트</h1>
//       <p>서버 응답: {message}</p>
//     </div>
//   );
// }

// export default App

// import MyChallenge from "./components/MyChallenge";

// function App() {
//   return <MyChallenge />;
// }

// export default App;




