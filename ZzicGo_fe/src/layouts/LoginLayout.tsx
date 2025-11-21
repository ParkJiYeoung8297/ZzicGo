import { Outlet } from "react-router-dom";

export default function LoginLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main */}
      <main className="flex-1 p-4">
        <Outlet /> {/* ✅ 자식 라우트가 이곳에 렌더링됩니다 */}
      </main>
    </div>
  );
}
