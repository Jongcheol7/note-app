import { useHasPw } from "@/hooks/settings/useHasPw";
import { useVerifyPw } from "@/hooks/settings/useVerifyPw";
import { useRef } from "react";

export default function PasswordCheckPopup({ setShow, onSuccess }) {
  const { data: hasPw, isLoading } = useHasPw();
  const { mutate, isPending, isError, error } = useVerifyPw();
  const currentPwRef = useRef();

  if (isLoading) {
    return null;
  }

  if (!hasPw) {
    alert("비밀번호가 설정되지 않았습니다. 세팅에서 설정후 사용가능합니다.");
    setShow(false);
    return null;
  }

  if (isError) {
    console.error("에러발생 : ", error);
  }

  return (
    <div>
      <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white px-5 py-7 rounded-xl z-50 shadow-lg">
        <div className="flex flex-col">
          <label className="text-sm font-medium mt-3">비밀번호</label>
          <input
            className="bg-gray-300 px-3 py-1 rounded-md"
            ref={currentPwRef}
            type="password"
            autoFocus
          />
        </div>
        <div className="flex justify-center gap-3">
          <button
            className="text-blue-500 font-bold hover:text-blue-700"
            disabled={isPending}
            onClick={() => {
              mutate(
                { password: currentPwRef.current.value },
                {
                  onSuccess: () => onSuccess(),
                }
              );
            }}
          >
            {isPending ? "확인중" : "확인"}
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
