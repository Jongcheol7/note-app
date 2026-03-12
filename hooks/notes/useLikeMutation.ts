import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface LikeMutationParams {
  isLike: boolean;
  noteNo: number;
}

export function useLikeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ isLike, noteNo }: LikeMutationParams) => {
      const res = await axios.post("/api/notes/like", {
        isLike: isLike,
        noteNo: noteNo,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noteLists"] });
      queryClient.invalidateQueries({ queryKey: ["noteDetail"] });
    },
    onError: (err: Error) => console.error("좋아요 업데이트 실패:", err),
  });
}
