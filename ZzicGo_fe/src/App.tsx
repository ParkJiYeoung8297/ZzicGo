import "./index.css";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


import RootLayout from "./layouts/RootLayout";

// 페이지 컴포넌트들 ...
import NotFoundPage from "./pages/common/NotFoundPage";
import SplashPage from "./pages/common/SplashPage";
import MainPage from "./pages/MainPage";

// 📄 소셜 로그인 관련 컴포넌트
import SocialLogin from "./components/auth/SocialLogin";
import OauthRedirect from "./pages/auth/OauthRedirect";
import SocialCallback from "./pages/auth/SocialCallback";
// import SocialSignupForm from "./pages/auth/SocialSignupForm";
// import SocialSignupDetailPage from "./pages/auth/SocialSignupDetailPage";


const router = createBrowserRouter([
    // ✅ Splash는 독립 페이지로 렌더링
  {
    path: "/",
    element: <SplashPage />,
  },
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // { index: true, element: <SplashPage /> }, // ✅ 처음엔 SplashPage
      // 소셜 로그인
      { path: "login", element: <SocialLogin /> },
      { path: "/oauth-redirect", element: <OauthRedirect /> },
      // { path: "/social-signup", element: <SocialSignupForm /> },
      // { path: "/social-signup/details", element: <SocialSignupDetailPage /> },
      { path: "/oauth/callback", element: <SocialCallback /> },

      // Spring Boot OAuth2 기본 콜백 경로 추가
      { path: "/login/oauth2/code/:provider", element: <SocialCallback /> },

    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
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




