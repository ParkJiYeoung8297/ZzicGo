import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 border-b bg-white shadow-sm flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-500">ZzicGo</h1>
        <nav>
          <a href="/" className="text-gray-700 hover:text-blue-500">Home</a>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 p-4">
        <Outlet /> {/* ✅ 자식 라우트가 이곳에 렌더링됩니다 */}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center border-t text-gray-500 text-sm">
        ZzicGo
      </footer>
    </div>
  );
}
