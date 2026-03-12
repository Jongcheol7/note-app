import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface ColorMutationParams {
  color: string;
  noteNo: number;
}

export function useColorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ color, noteNo }: ColorMutationParams) => {
      const res = await axios.post("/api/notes/color/save", {
        color: color,
        noteNo: noteNo,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noteLists"] });
    },
    onError: (err: Error) => console.error("컬러 저장 실패:", err),
  });
}
