export default function MainPage() {
  return (
    <div className="text-center mt-20">
      <h2 className="text-3xl font-semibold mb-4">Welcome to ZzicGo 🐆</h2>
      <p className="text-gray-600 mb-8">
        The fastest way to your goal — experience ZzicGo today!
      </p>
      <a
        href="/login"
        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
      >
        Go to Login
      </a>
    </div>
  );
}
