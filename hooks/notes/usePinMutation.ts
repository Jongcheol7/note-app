import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface PinMutationParams {
  isPinned: boolean;
  noteNo: number;
}

export function usePinMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isPinned, noteNo }: PinMutationParams) => {
      const res = await axios.post("/api/notes/pin", { isPinned, noteNo });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noteLists"] });
    },
    onError: (err: Error) => console.error("노트 핀 변경 실패 : ", err),
  });
}
