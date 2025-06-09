"use client";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAlarmMutation } from "../hooks/useAlarmMutation";
import { useState } from "react";
import { ko } from "date-fns/locale";

export default function CalenderPopup({
  show,
  setShow,
  alarmDatetime,
  noteNo,
  setAlarmDatetime,
}) {
  const { mutate, isPending } = useAlarmMutation();
  const [newDate, setNewDate] = useState(alarmDatetime ?? new Date());

  return (
    <>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 팝업 배경 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={() => setShow(false)}
          />

          {/* 달력 모달 */}
          <div className="relative z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 p-6 min-w-[320px]">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3">
              📅 알림 날짜 선택
            </h2>

            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={ko}
            >
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
              />
            </LocalizationProvider>

            <button
              className="mt-4 w-full py-2 text-sm font-medium rounded bg-blue-500 hover:bg-blue-600 text-white transition"
              disabled={isPending}
              onClick={() => {
                if (!noteNo) {
                  //새글 작성시 부모로 데이터보내고 저장시 한번에 저장
                  setAlarmDatetime(newDate);
                  setShow(false);
                } else {
                  //수정글일때
                  mutate(
                    { date: newDate, no: noteNo },
                    {
                      onSuccess: () => setShow(false),
                      onError: () => alert("날짜 설정에 실패했습니다."),
                    }
                  );
                }
              }}
            >
              {isPending ? "저장중" : "확인"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
