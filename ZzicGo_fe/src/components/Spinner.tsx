export default function Spinner() {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
    </div>
  );
}
