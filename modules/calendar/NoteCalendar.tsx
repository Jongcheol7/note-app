"use client";
import Calendar from "react-calendar";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addHours, format } from "date-fns";
import { ko } from "date-fns/locale";
import { useMonthlyAlarms } from "@/hooks/calendar/useMonthlyAlarms";
import { useQueryClient } from "@tanstack/react-query";

export default function NoteCalendar() {
  const [date, setDate] = useState(new Date());
  const router = useRouter();
  const queryClient = useQueryClient();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const { data: notes } = useMonthlyAlarms(year, month);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["monthlyAlarms", year, month] });
  }, [date]);

  const noteMap = useMemo(() => {
    const map: Record<string, { alarmDatetime: string; noteNo: number; title: string }[]> = {};
    notes?.forEach((note: { alarmDatetime: string; noteNo: number; title: string }) => {
      const key = format(
        addHours(new Date(note.alarmDatetime), -9),
        "yyyy-MM-dd"
      );
      if (!map[key]) map[key] = [];
      map[key].push(note);
    });
    return map;
  }, [notes]);

  return (
    <div className="pt-2">
      <Calendar
        onChange={(value) => { if (value instanceof Date) setDate(value); }}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setDate(activeStartDate);
        }}
        value={date}
        locale="ko-KR"
        formatMonthYear={(locale, date) =>
          format(date, "yyyy년 M월", { locale: ko })
        }
        formatShortWeekday={(locale, date) =>
          format(date, "EEEEE", { locale: ko })
        }
        className="rounded-2xl bg-card p-5 border border-border shadow-card text-sm"
        tileClassName={({ date }) => {
          const isToday =
            format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
          return isToday
            ? "bg-primary/10 text-primary font-semibold rounded-xl"
            : "rounded-xl hover:bg-secondary transition-colors";
        }}
        tileContent={({ date }) => {
          const key = format(date, "yyyy-MM-dd");
          const dayNotes = noteMap[key] || [];
          return (
            <div className="mt-1 flex flex-col items-start min-h-[32px]">
              {dayNotes.map((note) => (
                <div
                  key={note.noteNo}
                  className="text-2xs text-accent w-full font-semibold cursor-pointer hover:underline truncate"
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
        navigationLabel={({ label }) => (
          <div className="w-full text-center text-base font-semibold">
            {label}
          </div>
        )}
        nextLabel="›"
        prevLabel="‹"
        next2Label={null}
        prev2Label={null}
      />
    </div>
  );
}
