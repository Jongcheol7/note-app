import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useTrashRecovery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteNo) => {
      return axios
        .post("/api/notes/trash/recover", { noteNo })
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["noteList"]);
      queryClient.invalidateQueries(["trashLists"]);
    },
    onError: (err) => console.log("메모 복원 실패 : ", err),
  });
}
