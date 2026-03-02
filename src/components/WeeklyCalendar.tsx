"use client";

import { format, startOfWeek, addDays, isToday, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

interface WeeklyCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  completedDates: string[];
}

export default function WeeklyCalendar({ selectedDate, onSelectDate, completedDates }: WeeklyCalendarProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="card-3d">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-heading text-[15px] text-gray-800">
          {format(selectedDate, "yyyy년 M월", { locale: ko })}
        </h3>
        <span className="pill bg-purple-50 text-purple-500">
          {format(weekStart, "M.d")} - {format(addDays(weekStart, 6), "M.d")}
        </span>
      </div>
      <div className="flex justify-between gap-1">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const isSelected = isSameDay(day, selectedDate);
          const isDone = completedDates.includes(dateStr);
          const isTodayDate = isToday(day);

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(day)}
              className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-2xl transition-all flex-1 ${
                isSelected
                  ? "text-white shadow-lg"
                  : "hover:bg-purple-50/50"
              }`}
              style={
                isSelected
                  ? {
                      background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
                      boxShadow: "0 8px 24px rgba(124, 92, 252, 0.35)",
                    }
                  : {}
              }
            >
              <span className={`text-[10px] font-bold ${
                isSelected ? "text-white/70" : "text-gray-400"
              }`}>
                {format(day, "EEE", { locale: ko })}
              </span>
              <span className={`text-[15px] font-extrabold ${
                isSelected ? "text-white" : isTodayDate ? "text-[#7c5cfc]" : "text-gray-700"
              }`}>
                {format(day, "d")}
              </span>
              <div className={`w-1.5 h-1.5 rounded-full ${
                isDone
                  ? isSelected ? "bg-white" : "bg-emerald-400"
                  : "bg-transparent"
              }`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
