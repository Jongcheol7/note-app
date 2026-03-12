import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface TrashDeletePayload {
  noteNo: number;
}

export function useTrashDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteNo: TrashDeletePayload) => {
      return axios
        .delete("/api/notes/trash/delete", { data: noteNo })
        .then((res) => res.data);
    },
    onSuccess: () => {
      //queryClient.invalidateQueries({ queryKey: ["noteList"] });
      queryClient.invalidateQueries({ queryKey: ["noteLists"] });
    },
    onError: (err: Error) => console.error("메모 영구삭제 실패:", err),
  });
}
