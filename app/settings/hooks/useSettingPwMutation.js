import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useSettingPwMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ currentPw, password }) => {
      try {
        const res = await axios.post("/api/settings/password", {
          currentPw,
          password,
        });
        return res.data;
      } catch (err) {
        const message = err.response?.data;
        throw new Error(message);
      }
    },
    onSuccess: () => {},
    onError: (err) => {
      alert(err.message);
    },
  });
}
