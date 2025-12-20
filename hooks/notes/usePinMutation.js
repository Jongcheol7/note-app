import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function usePinMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isPinned, noteNo }) => {
      const res = await axios.post("/api/notes/pin", { isPinned, noteNo });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["noteLists"]);
    },
    onError: (err) => console.error("노트 핀 변경 실패 : ", err),
  });
}
