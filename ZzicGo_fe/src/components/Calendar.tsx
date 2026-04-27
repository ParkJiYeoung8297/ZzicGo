import { useEffect, useMemo, useState } from "react";

interface CalendarProps {
  onSelectDate?: (date: Date) => void;
  highlightedDates?: string[];
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Calendar({
  onSelectDate,
  highlightedDates = [],
}: CalendarProps) {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  const highlightedDateSet = useMemo(
    () => new Set(highlightedDates),
    [highlightedDates]
  );

  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();
  const startDay = firstDay.getDay();

  const calendarDays: { day: number; type: "prev" | "current" | "next" }[] = [];

  for (let i = startDay; i > 0; i--) {
    calendarDays.push({
      day: prevLastDate - i + 1,
      type: "prev",
    });
  }

  for (let i = 1; i <= lastDate; i++) {
    calendarDays.push({ day: i, type: "current" });
  }

  const nextDays = 42 - calendarDays.length;
  for (let i = 1; i <= nextDays; i++) {
    calendarDays.push({ day: i, type: "next" });
  }

  const prevMonth = () => {
    const nextDate =
      month === 0
        ? new Date(year - 1, 11, 1)
        : new Date(year, month - 1, 1);

    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }

    setSelectedDate(nextDate);
    onSelectDate?.(nextDate);
  };

  const nextMonth = () => {
    const nextDate =
      month === 11
        ? new Date(year + 1, 0, 1)
        : new Date(year, month + 1, 1);

    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }

    setSelectedDate(nextDate);
    onSelectDate?.(nextDate);
  };

  const handleSelectDay = (item: { day: number; type: "prev" | "current" | "next" }) => {
    let selected;

    if (item.type === "prev") {
      selected = new Date(year, month - 1, item.day);
    } else if (item.type === "next") {
      selected = new Date(year, month + 1, item.day);
    } else {
      selected = new Date(year, month, item.day);
    }

    setSelectedDate(selected);
    onSelectDate?.(selected);
  };

  useEffect(() => {
    if (!selectedDate) return;
    onSelectDate?.(selectedDate);
  }, []);

  const isSameDate = (d1: Date | null, d2: Date) => {
    if (!d1) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  return (
    <div className="mx-auto w-80 max-w-full rounded-2xl bg-white p-4 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={prevMonth} className="text-lg">
          &lt;
        </button>
        <span className="text-lg font-semibold">
          {year}년 {month + 1}월
        </span>
        <button onClick={nextMonth} className="text-lg">
          &gt;
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 text-center text-sm text-gray-500">
        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {calendarDays.map((item, i) => {
          const isToday =
            item.type === "current" &&
            item.day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          const currentDate =
            item.type === "current"
              ? new Date(year, month, item.day)
              : item.type === "prev"
                ? new Date(year, month - 1, item.day)
                : new Date(year, month + 1, item.day);

          const isSelected = isSameDate(selectedDate, currentDate);
          const isHighlighted = highlightedDateSet.has(toDateKey(currentDate));

          return (
            <div
              key={i}
              onClick={() => handleSelectDay(item)}
              className={`
                mx-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-full
                ${item.type !== "current" ? "text-gray-300" : "text-gray-900"}
                ${isHighlighted ? "bg-yellow-300 font-bold text-[#6B440B]" : ""}
                ${isSelected ? "ring-2 ring-[#D98B00]" : ""}
                ${!selectedDate && isToday ? "bg-yellow-300 text-black font-bold" : ""}
                ${selectedDate && isToday && !isSelected && !isHighlighted ? "bg-gray-200 text-black font-bold" : ""}
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
