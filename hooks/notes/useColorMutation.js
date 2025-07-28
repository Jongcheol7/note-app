import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useColorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ color, noteNo }) => {
      const res = await axios.post("/api/notes/color/save", {
        color: color,
        noteNo: noteNo,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["noteLists"]);
    },
    onError: (err) => console.log("컬러 저장 실패 : ", err),
  });
}
