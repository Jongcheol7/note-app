"use client";
import Calendar from "react-calendar";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useMonthlyAlarms } from "@/hooks/calendar/useMonthlyAlarms";

export default function NoteCalendar() {
  const [date, setDate] = useState(new Date());
  const router = useRouter();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const { data: notes } = useMonthlyAlarms(year, month);

  const noteMap = useMemo(() => {
    const map = {};
    notes?.forEach((note) => {
      const key = format(new Date(note.alarmDatetime), "yyyy-MM-dd");
      if (!map[key]) map[key] = [];
      map[key].push(note);
    });
    return map;
  }, [notes]);

  return (
    <div className="p-2  mx-auto">
      <Calendar
        onChange={setDate}
        value={date}
        locale="ko-KR"
        // 📌 년/월 출력 포맷 변경
        formatMonthYear={(locale, date) =>
          format(date, "yyyy년 M월", { locale: ko })
        }
        // 📌 요일 표시 스타일
        formatShortWeekday={(locale, date) =>
          format(date, "EEEEE", { locale: ko })
        } // 월~일 한 글자
        className="rounded-xl shadow-lg bg-white text-gray-800 p-4 border border-gray-200 text-sm"
        // 📌 오늘 날짜 강조
        tileClassName={({ date }) => {
          const isToday =
            format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
          return isToday ? "bg-blue-100 rounded-full font-bold" : "";
        }}
        // 📌 날짜 셀 내용 커스터마이징
        tileContent={({ date }) => {
          const key = format(date, "yyyy-MM-dd");
          const dayNotes = noteMap[key] || [];

          return (
            <div className="mt-1 flex flex-col items-start min-h-[40px]">
              {dayNotes.map((note) => (
                <div
                  key={note.noteNo}
                  className="text-[10px] text-blue-600 w-full cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/notes/${note.noteNo}`);
                  }}
                >
                  {note.title}
                </div>
              ))}
            </div>
          );
        }}
        // 📌 아래는 추가로 넣어야 할 CSS 커스터마이징 클래스
        navigationLabel={({ date, label }) => (
          <div className="w-full text-center text-lg font-semibold">
            {label}
          </div>
        )}
        // 커스텀 클래스명 넣기
        nextLabel="▶"
        prevLabel="◀"
        next2Label={null}
        prev2Label={null}
      />
      <p className="mt-4 text-sm text-center text-gray-700">
        선택된 날짜: {date.toLocaleDateString("ko-KR")}
      </p>
    </div>
  );
}
