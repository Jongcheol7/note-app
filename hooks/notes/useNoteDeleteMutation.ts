import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface DeleteNotePayload {
  noteNo: number;
}

export function useNoteDeleteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteNo: DeleteNotePayload) => {
      return axios
        .delete("/api/notes/delete", { data: noteNo })
        .then((res) => res.data);
    },
    onSuccess: () => {
      // 삭제 성공시 노트 캐시를 무효화해서 다시 불러올수 있도록 하자..
      queryClient.invalidateQueries({ queryKey: ["noteLists"] });
      queryClient.invalidateQueries({ queryKey: ["noteDetail"] });
    },
    onError: (err: Error) => console.error("메모 삭제 실패:", err),
  });
}
