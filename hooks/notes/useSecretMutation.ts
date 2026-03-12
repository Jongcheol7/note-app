import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface SecretMutationParams {
  noteNo: number;
}

export function useSecretMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ noteNo }: SecretMutationParams) => {
      const res = await axios.post(`/api/notes/secret`, {
        noteNo,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noteLists"] });
      queryClient.invalidateQueries({ queryKey: ["noteDetail"] });
    },
    onError: (err: Error) => console.error("비밀글 설정 실패:", err),
  });
}
