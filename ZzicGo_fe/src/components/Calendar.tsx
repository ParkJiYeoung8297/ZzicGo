import { useState } from "react";

export default function Calendar() {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0 = 1월, 11 = 12월

  // 현재 달의 첫 날
  const firstDay = new Date(year, month, 1);
  // 현재 달이 총 며칠인지
  const lastDate = new Date(year, month + 1, 0).getDate();
  // 이전 달 마지막 날짜 (빈칸 채우기용)
  const prevLastDate = new Date(year, month, 0).getDate();

  // 첫 주의 요일 (0=일)
  const startDay = firstDay.getDay();

  // 달력 데이터 배열 생성
  const calendarDays: { day: number; type: "prev" | "current" | "next" }[] = [];

  // 1️⃣ 이전 달 날짜 (앞 빈칸)
  for (let i = startDay; i > 0; i--) {
    calendarDays.push({
      day: prevLastDate - i + 1,
      type: "prev",
    });
  }

  // 2️⃣ 현재 달 날짜
  for (let i = 1; i <= lastDate; i++) {
    calendarDays.push({ day: i, type: "current" });
  }

  // 3️⃣ 다음 달 날짜 (뒤 빈칸)
  const nextDays = 42 - calendarDays.length; // 6줄 × 7칸 = 42칸 기준
  for (let i = 1; i <= nextDays; i++) {
    calendarDays.push({ day: i, type: "next" });
  }

  // 월 이동 함수
  const prevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-80 mx-auto">
      
      {/* 헤더: 이전/다음 버튼 */}
      <div className="flex justify-between items-center mb-3">
        <button onClick={prevMonth} className="text-lg">&lt;</button>
        <span className="text-lg font-semibold">
          {year}년 {month + 1}월
        </span>
        <button onClick={nextMonth} className="text-lg">&gt;</button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 text-center text-gray-500 text-sm mb-2">
        <div>일</div><div>월</div><div>화</div><div>수</div>
        <div>목</div><div>금</div><div>토</div>
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {calendarDays.map((item, i) => {
          const isToday =
            item.type === "current" &&
            item.day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div
              key={i}
              className={`
                w-8 h-8 flex items-center justify-center mx-auto rounded-full
                ${
                  item.type === "prev" || item.type === "next"
                    ? "text-gray-300"
                    : "text-gray-900"
                }
                ${isToday ? "bg-yellow-400 text-white font-semibold" : ""}
              `}
            >
              {item.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
