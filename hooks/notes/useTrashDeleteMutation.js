import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useTrashDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteNo) => {
      return axios
        .delete("/api/notes/trash/delete", { data: noteNo })
        .then((res) => res.data);
    },
    onSuccess: () => {
      //queryClient.invalidateQueries(["noteList"]);
      queryClient.invalidateQueries(["trashLists"]);
    },
    onError: (err) => console.log("메모 영구삭제 실패 : ", err),
  });
}
