import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useLikeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ isLike, noteNo }) => {
      console.log("리엑트쿼리 내부 like : ", isLike, noteNo);
      const res = await axios.post("/api/notes/like", {
        isLike: isLike,
        noteNo: noteNo,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["communitylists"]);
    },
    onError: (err) => console.log("좋아요 업데이트 실패 : ", err),
  });
}
