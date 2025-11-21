import { useEffect, useState } from "react";

export default function InstallPromptBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // ✅ 이미 안내한 적 있다면 배너 안 띄움
      const hasShownPrompt = localStorage.getItem("installPromptShown");
      if (!hasShownPrompt) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // ✅ 설치창 띄우기
    (deferredPrompt as any).prompt();

    // ✅ 설치 이후엔 다시 안 뜨게 저장
    localStorage.setItem("installPromptShown", "true");
    setShowBanner(false);
  };

  const handleClose = () => {
    setShowBanner(false);
    localStorage.setItem("installPromptShown", "true");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-blue-500 text-white flex items-center justify-between px-4 py-3 shadow-md animate-slide-up">
      <p className="text-sm">
        📱 ZzicGo를 홈 화면에 추가해 더 빠르게 실행해보세요!
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="bg-white text-blue-600 px-3 py-1 rounded font-semibold"
        >
          설치
        </button>
        <button
          onClick={handleClose}
          className="bg-blue-800 px-3 py-1 rounded"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
