import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function usePublicMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ isPublic, noteNo }) => {
      //console.log("공개여부 리엑트쿼리 부분 진입 :", isPublic, noteNo);
      const res = await axios.post("/api/notes/public", {
        isPublic,
        noteNo,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["noteLists", "noteDetail"]);
    },
    onError: (err) => console.log("공개여부 업데이트 실패 :", err),
  });
}
