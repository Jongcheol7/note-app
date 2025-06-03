import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useLikeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ isLike, noteNo }) => {
      const res = await axios.post("/api/community/like", {
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
