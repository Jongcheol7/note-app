import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useTrashRecovery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteNo: number) => {
      return axios
        .post("/api/notes/trash/recover", { noteNo })
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noteLists"] });
      queryClient.invalidateQueries({ queryKey: ["trashLists"] });
    },
    onError: (err: Error) => console.error("메모 복원 실패:", err),
  });
}
