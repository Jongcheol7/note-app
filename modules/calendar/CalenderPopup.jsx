"use client";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { ko } from "date-fns/locale";
import { useNoteFormStore } from "@/store/useNoteFormStore";
import { useAlarmMutation } from "@/hooks/calendar/useAlarmMutation";

export default function CalenderPopup({ setShow, setButtonAction }) {
  const { noteNo, alarmDatetime, setAlarmDatetime } = useNoteFormStore();

  const { mutate, isPending } = useAlarmMutation();
  const [newDate, setNewDate] = useState(alarmDatetime ?? new Date());

  return (
    // ✅ 배경 클릭 시 팝업 닫기 + 토글도 닫기
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => {
        setShow(false);
        setButtonAction(false);
      }}
    >
      {/* ✅ 모달 본체 - 내부 클릭은 닫힘 방지 */}
      <div
        className="relative z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 p-6 min-w-[320px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3">
          📅 알림 날짜 선택
        </h2>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
          <DateTimePicker
            value={new Date(newDate)}
            onChange={(newValue) => setNewDate(newValue)}
            ampm={false}
            minutesStep={1}
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                borderRadius: 1,
                backgroundColor: "#f9fafb",
              },
            }}
            // ✅ Portal 사용 방지 (문제 해결 핵심)
            slotProps={{
              popper: {
                disablePortal: true,
              },
            }}
          />
        </LocalizationProvider>

        {/* ✅ 확인 버튼 */}
        <button
          className="mt-4 w-full py-2 text-sm font-medium rounded bg-blue-500 hover:bg-blue-600 text-white transition"
          disabled={isPending}
          onClick={() => {
            if (!noteNo) {
              // ✍️ 새 메모: zustand에 상태만 저장
              setAlarmDatetime(newDate);
              setShow(false);
              setButtonAction(false);
            } else {
              // ✍️ 수정 메모: 서버에 저장
              mutate({
                date: newDate,
                no: noteNo,
                setShow, // setShow와 setButtonAction은 내부에서 처리해도 되고 여기서 처리해도 됨
              });
              setButtonAction(false); // ✅ 바로 닫기
            }
          }}
        >
          {isPending ? "저장중" : "확인"}
        </button>
      </div>
    </div>
  );
}
