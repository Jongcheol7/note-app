"use client";
import { useHasPw } from "@/hooks/settings/useHasPw";
import { useVerifyPw } from "@/hooks/settings/useVerifyPw";
import { useFromStore } from "@/store/useFromStore";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import { MENU } from "@/lib/constants";
import Popup from "@/components/common/Popup";

interface PasswordCheckPopupProps {
  setShow: (v: boolean) => void;
  onSuccess: () => void;
}

export default function PasswordCheckPopup({ setShow, onSuccess }: PasswordCheckPopupProps) {
  const { data: hasPw, isLoading } = useHasPw();
  const { mutate, isPending, isError, error } = useVerifyPw();
  const currentPwRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { menuFrom, setMenuFrom } = useFromStore();

  if (isLoading) {
    return null;
  }

  if (!hasPw) {
    toast.error(
      "비밀번호가 설정되지 않았습니다. 세팅에서 설정후 사용가능합니다."
    );
    return false;
  }

  if (isError) {
    toast.error("에러발생 : ", error);
  }

  return (
    <Popup onClose={() => setShow(false)} className="px-5 py-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-gray-700">비밀번호</label>
        <input
          className="bg-gray-300 px-3 py-1 rounded-md"
          ref={currentPwRef}
          type="password"
          autoFocus
        />
      </div>
      <div className="flex justify-center gap-3 mt-2">
        <button
          className="text-blue-500 font-bold hover:text-blue-700 hover:bg-gray-200 bg-gray-300 px-3 py-1 rounded-full"
          disabled={isPending}
          onClick={() => {
            mutate(
              { password: currentPwRef.current?.value ?? "" },
              {
                onSuccess: () => {
                  setMenuFrom(MENU.SECRET);
                  onSuccess();
                },
              }
            );
          }}
        >
          {isPending ? "확인중" : "확인"}
        </button>
        <button
          className="text-red-500 font-bold hover:text-red-700 hover:bg-gray-200 bg-gray-300 px-3 py-1 rounded-full"
          onClick={() => setShow(false)}
        >
          취소
        </button>
      </div>
    </Popup>
  );
}
