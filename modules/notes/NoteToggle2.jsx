"use client";

import { useTrashDelete } from "@/hooks/notes/useTrashDeleteMutation";
import { useTrashRecovery } from "@/hooks/notes/useTrashRecovery";
import { RotateCcw, Trash } from "lucide-react";

export default function NoteToggle2({ noteNo, setButtonAction }) {
  const { mutate: revocerMutate, isPending: isRecovering } = useTrashRecovery();
  const { mutate: trashDeleteMutate, isPending: isTrashDeleting } =
    useTrashDelete();
  return (
    <div className="absolute right-0 top-0 w-36 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-50 text-sm space-y-1">
      <button
        className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition text-left"
        disabled={isRecovering}
        onClick={() => {
          revocerMutate(
            { noteNo },
            {
              onSuccess: () => {
                alert("복원 완료!");
                router.push("/");
              },
            }
          );
        }}
      >
        <RotateCcw className="text-green-500" />
        <span className="text-gray-800 dark:text-gray-200">
          {isRecovering ? "복원중" : "복원하기"}
        </span>
      </button>

      <button
        className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition text-left"
        disabled={isTrashDeleting}
        onClick={() => {
          trashDeleteMutate(
            { noteNo },
            {
              onSuccess: () => {
                alert("영구 삭제 완료!");
                router.push("/");
              },
            }
          );
        }}
      >
        <Trash className="text-red-500" />
        <span className="text-gray-800 dark:text-gray-200">
          {isTrashDeleting ? "삭제중" : "영구삭제하기"}
        </span>
      </button>
    </div>
  );
}
