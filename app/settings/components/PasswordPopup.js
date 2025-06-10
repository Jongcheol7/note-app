import { useRef } from "react";
import { useSettingPwMutation } from "../hooks/useSettingPwMutation";
import { useHasPw } from "../hooks/useHasPw";

export default function PasswordPopup({ show, setShow }) {
  const { data: hasPw } = useHasPw();
  console.log("hasPw ::::::: ", hasPw);
  const { mutate, isPending, isError, error } = useSettingPwMutation();
  const currentPwRef = useRef();
  const pwRef = useRef();
  const pwChkRef = useRef();
  if (!show) return null;

  if (isError) {
    console.error("에러발생 : ", error);
  }

  const handleConfirm = () => {
    const pw = pwRef.current.value || "";
    const pwChk = pwChkRef.current.value || "";
    const currentPw = currentPwRef?.current?.value || "";
    if (hasPw && !currentPw) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }
    if (!pw || !pwChk) {
      alert("비밀번호를 모두 입력해주세요.");
      return;
    }
    if (pw !== pwChk) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    mutate(
      { currentPw: currentPw, password: pw },
      {
        onSuccess: () => {
          setShow(false);
        },
      }
    );
  };

  return (
    <div>
      <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white px-5 py-7 rounded-xl z-50 shadow-lg">
        <p className="text-xl font-bold text-center">비밀번호 설정</p>
        {hasPw && (
          <div className="flex flex-col">
            <label className="text-sm font-medium mt-3">현재 비밀번호</label>
            <input
              className="bg-gray-300 px-3 py-1 rounded-md"
              ref={currentPwRef}
              type="password"
              autoFocus
            />
          </div>
        )}
        <div className="flex flex-col">
          <div className="flex flex-col">
            <label className="text-sm font-medium mt-3">비밀번호</label>
            <input
              className="bg-gray-300 px-3 py-1 rounded-md"
              ref={pwRef}
              type="password"
              autoFocus
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mt-3">비밀번호 확인</label>
            <input
              className="bg-gray-300 px-3 py-1 mb-3 rounded-md"
              ref={pwChkRef}
              type="password"
            />
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <button
            className="text-blue-500 font-bold hover:text-blue-700"
            disabled={isPending}
            onClick={() => handleConfirm()}
          >
            {isPending ? "변경중" : "변경"}
          </button>
          <button
            className="text-gray-500 font-bold hover:text-gray-700"
            onClick={() => setShow(false)}
          >
            취소
          </button>
        </div>
      </div>
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-20"
        onClick={() => setShow(false)}
      />
    </div>
  );
}
