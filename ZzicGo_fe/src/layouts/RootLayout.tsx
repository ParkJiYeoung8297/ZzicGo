import { Outlet } from "react-router-dom";
import { usePageTracking } from "../hooks/usePageTracking";

export default function RootLayout() {
  usePageTracking(); 

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {/* <header className="p-4 border-b bg-white shadow-sm flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-500">ZzicGo</h1>
        <nav>
          <a href="/" className="text-gray-700 hover:text-blue-500">Home</a>
        </nav>

      </header> */}

      {/* Main */}
      <main className="flex-1 p-4">
        <Outlet /> {/* ✅ 자식 라우트가 이곳에 렌더링됩니다 */}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t text-gray-600 text-sm flex flex-col items-center gap-3">

        {/* 로고 */}
        <div className="text-xl font-bold">ZzicGo</div>

        {/* 이용약관 / 개인정보처리방침 */}
        <div className="flex items-center gap-8 text-base">

          <a
            href="http://iodized-chartreuse-9ca.notion.site/2ae0b06a074280f48f79fe33d68040d7?pvs=74"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition"
          >
            이용약관
          </a>

          <a
            href="https://iodized-chartreuse-9ca.notion.site/2ae0b06a0742809a9fa9e1b1fffa7469"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition"
          >
            개인정보처리방침
          </a>

        </div>

      </footer>

    </div>
  );
}
