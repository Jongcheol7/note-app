import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useSettingPwMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ password }) => {
      const res = await axios.post("/api/settings/password", { password });
    },
    onSuccess: () => {},
    onError: (err) => console.log("비밀번호 설정 실패 : ", err),
  });
}
