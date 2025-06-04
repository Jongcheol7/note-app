import { useRef } from "react";
import { useSettingPwMutation } from "../hooks/useSettingPwMutation";

export default function PasswordPopup({ show, setShow }) {
  const { mutate, isPending } = useSettingPwMutation();
  const pwRef = useRef();
  const pwChkRef = useRef();
  if (!show) return null;

  const handleConfirm = () => {
    const pw = pwRef.current.value || "";
    const pwChk = pwChkRef.current.value || "";
    if (!pw || !pwChk) {
      alert("비밀번호를 모두 입력해주세요.");
      return;
    }
    if (pw !== pwChk) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    mutate(
      { password: pw },
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
        <p className="text-2xl font-bold text-center">비밀번호 설정</p>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="flex-1 text-center">비밀번호</span>
            <input
              className="bg-gray-300 px-3 py-1 mt-3 rounded-md"
              ref={pwRef}
              type="password"
            />
          </div>
          <div className="flex items-center">
            <span className="flex-1 text-center">확인</span>
            <input
              className="bg-gray-300 px-3 py-1 my-3 rounded-md"
              ref={pwChkRef}
              type="password"
            />
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <button
            className="text-blue-500 font-bold hover:text-blue-700"
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
