export default function FilterBar() {
  return (
    <div className="flex gap-2 mt-4 px-4">
      <button className="bg-yellow-400 rounded-full px-4 py-2 text-sm font-semibold">
        인기순 ▼
      </button>
      <button className="bg-yellow-400 rounded-full px-4 py-2 text-sm font-semibold">
        여성 ▼
      </button>
      <button className="border rounded-full px-4 py-2 text-sm text-gray-600">
        전체 연령 ▼
      </button>
    </div>
  );
}
