"use client";

import { useTrashDelete } from "@/hooks/notes/useTrashDeleteMutation";
import { useTrashRecovery } from "@/hooks/notes/useTrashRecovery";
import { RotateCcw, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import Popup from "@/components/common/Popup";

interface NoteToggle2Props {
  noteNo: number;
  setButtonAction: (v: boolean) => void;
  initialData?: Record<string, unknown>;
}

export default function NoteToggle2({ noteNo, setButtonAction }: NoteToggle2Props) {
  const { mutate: revocerMutate, isPending: isRecovering } = useTrashRecovery();
  const { mutate: trashDeleteMutate, isPending: isTrashDeleting } = useTrashDelete();
  const router = useRouter();

  return (
    <Popup onClose={() => setButtonAction(false)} bottomSheet>
      <div className="space-y-1">
        <button
          className="btn-menu-item"
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
          <RotateCcw className="w-5 h-5 text-green-500" />
          <span className="font-medium">
            {isRecovering ? "복원중..." : "복원하기"}
          </span>
        </button>

        <button
          className="btn-menu-item"
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
          <Trash className="w-5 h-5 text-destructive" />
          <span className="font-medium">
            {isTrashDeleting ? "삭제중..." : "영구삭제하기"}
          </span>
        </button>
      </div>
    </Popup>
  );
}
