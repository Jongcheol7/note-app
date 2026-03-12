"use client";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { ko } from "date-fns/locale";
import { useNoteFormStore } from "@/store/useNoteFormStore";
import { useAlarmMutation } from "@/hooks/calendar/useAlarmMutation";
import Popup from "@/components/common/Popup";

interface CalenderPopupProps {
  setShow: (v: boolean) => void;
  setButtonAction: (v: boolean) => void;
}

export default function CalenderPopup({ setShow, setButtonAction }: CalenderPopupProps) {
  const { noteNo, alarmDatetime, setAlarmDatetime } = useNoteFormStore();

  const { mutate, isPending } = useAlarmMutation();
  const [newDate, setNewDate] = useState<Date>(
    alarmDatetime ? new Date(alarmDatetime) : new Date()
  );

  const handleClose = () => {
    setShow(false);
    setButtonAction(false);
  };

  return (
    <Popup onClose={handleClose} className="rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 p-6 min-w-[320px] dark:bg-gray-800">
      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3">
        📅 알림 날짜 선택
      </h2>

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
        <DateTimePicker
          value={new Date(newDate)}
          onChange={(newValue) => { if (newValue) setNewDate(newValue); }}
          ampm={false}
          minutesStep={1}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              borderRadius: 1,
              backgroundColor: "#f9fafb",
            },
          }}
          slotProps={{
            popper: {
              disablePortal: true,
            },
          }}
        />
      </LocalizationProvider>

      <button
        className="mt-4 w-full py-2 text-sm font-medium rounded bg-blue-500 hover:bg-blue-600 text-white transition"
        disabled={isPending}
        onClick={() => {
          if (!noteNo) {
            setAlarmDatetime(newDate.toISOString());
            handleClose();
          } else {
            mutate(
              { date: newDate.toISOString(), no: noteNo },
              { onSuccess: () => handleClose() }
            );
          }
        }}
      >
        {isPending ? "저장중" : "확인"}
      </button>
    </Popup>
  );
}
