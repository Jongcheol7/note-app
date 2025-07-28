"use client";

import { useTrashDelete } from "@/hooks/notes/useTrashDeleteMutation";
import { useTrashRecovery } from "@/hooks/notes/useTrashRecovery";

export default function NoteToggle2({ noteNo, setButtonAction }) {
  const { mutate: revocerMutate, isPending: isRecovering } = useTrashRecovery();
  const { mutate: trashDeleteMutate, isPending: isTrashDeleting } =
    useTrashDelete();
  return (
    <div className="absolute right-0 top-5 mt-2  w-24 bg-white dark:bg-gray-700 border border-gray-200 rounded-xl shadow-lg z-20 text-sm">
      <button
        className="block w-full text-left px-4 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
        disabled={isRecovering}
        onClick={() => {
          revocerMutate(
            { noteNo },
            {
              onSuccess: () => {
                alert("복원 완료!");
                router.push("/notes/trash");
              },
            }
          );
        }}
      >
        복원
      </button>
      <button
        className="block w-full text-left px-4 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
        disabled={isTrashDeleting}
        onClick={() => {
          trashDeleteMutate(
            { noteNo },
            {
              onSuccess: () => {
                alert("영구 삭제 완료!");
                router.push("/notes/trash");
              },
            }
          );
        }}
      >
        영구삭제
      </button>
    </div>
  );
}
