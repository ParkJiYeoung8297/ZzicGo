import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-white overflow-hidden ">
       <div className="w-[70vw] h-[70vh] flex items-center justify-center">
        <video
          src="/splash.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          className="max-w-sm w-[70vw] max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
}
