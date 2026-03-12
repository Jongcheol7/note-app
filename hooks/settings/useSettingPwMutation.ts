import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface SettingPwParams {
  currentPw: string;
  password: string;
}

export function useSettingPwMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ currentPw, password }: SettingPwParams) => {
      try {
        const res = await axios.post("/api/settings/password", {
          currentPw,
          password,
        });
        return res.data;
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<string>;
        const message = axiosErr.response?.data;
        throw new Error(message);
      }
    },
    onError: (err: Error) => alert(err.message),
  });
}
