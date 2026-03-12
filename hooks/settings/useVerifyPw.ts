import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface VerifyPwParams {
  password: string;
}

export function useVerifyPw() {
  return useMutation({
    mutationFn: async ({ password }: VerifyPwParams) => {
      try {
        const res = await axios.post("/api/settings/password/verify", {
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
