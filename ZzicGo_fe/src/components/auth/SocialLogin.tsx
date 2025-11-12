export default function SocialLogin() {
  const handleNaverLogin = () => {
    window.location.href =
      "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/oauth/callback&state=test";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h2 className="text-2xl font-bold mb-6">Login with Social Account</h2>

      <button
        onClick={handleNaverLogin}
        className="w-64 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition mb-3"
      >
        Login with Naver
      </button>

      <button
        disabled
        className="w-64 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
      >
        (Coming Soon) Kakao Login
      </button>
    </div>
  );
}
