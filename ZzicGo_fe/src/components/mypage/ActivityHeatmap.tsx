// src/components/ActivityHeatmap.tsx

import dayjs from "dayjs"; //npm install dayjs

const COLORS = ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"];

// 최근 90일 데이터 생성 (Mock)
function generateMockData() {
  const today = dayjs();
  const days = 120; // 최근 4개월 정도
  const data: Record<string, number> = {};

  for (let i = 0; i < days; i++) {
    const date = today.subtract(i, "day").format("YYYY-MM-DD");
    data[date] = Math.floor(Math.random() * 5); // 0~4 단계
  }

  return data;
}

export default function ActivityHeatmap() {
  const data = generateMockData();

  const startDate = dayjs().subtract(120, "day");
  const endDate = dayjs();

  // 날짜 배열 생성
  const days: string[] = [];
  let cur = startDate;

  while (cur.isBefore(endDate) || cur.isSame(endDate)) {
    days.push(cur.format("YYYY-MM-DD"));
    cur = cur.add(1, "day");
  }

  // GitHub처럼 7행 단위로 컬럼 만들기
  const rows = 7;
  const columns = Math.ceil(days.length / rows);

  // 월(Month) 라벨 위치 계산
  const monthLabels: Record<number, string> = {};
  days.forEach((date, idx) => {
    const d = dayjs(date);
    if (d.date() === 1) {
      const col = Math.floor(idx / rows);
      monthLabels[col] = d.format("MMM");
    }
  });

  return (
    <div className="p-4 border rounded-xl bg-white mt-4">
      <div className="text-sm text-gray-500 mb-3">활동 히트맵</div>

      <div className="overflow-x-auto">
        {/* 월 라벨 */}
        <div className="flex ml-6 mb-2 text-xs text-gray-600 gap-[3px]">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} className="w-4 text-center">
              {monthLabels[colIdx]}
            </div>
          ))}
        </div>

        <div className="flex gap-[3px]">
          
          {/* 요일 라벨 (Mon Wed Fri만 표시) */}
          <div className="flex flex-col justify-between mr-2 text-xs text-gray-600">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* 히트맵 */}
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-[3px]">
              {Array.from({ length: rows }).map((_, rowIdx) => {
                const idx = colIdx * rows + rowIdx;
                const date = days[idx];

                const value = date ? data[date] ?? 0 : 0;

                return (
                  <div
                    key={rowIdx}
                    className="w-4 h-4 rounded-sm"
                    style={{
                      backgroundColor: COLORS[value],
                    }}
                    title={`${date} 활동: ${value}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
