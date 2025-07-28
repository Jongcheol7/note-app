import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useSecretMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ noteNo }) => {
      const res = await axios.post(`/api/notes/secret`, {
        noteNo,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["noteDetail"]);
    },
    onError: (err) => console.log("비밀글 설정 실패 : ", err),
  });
}
