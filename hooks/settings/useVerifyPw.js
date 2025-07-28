import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useVerifyPw() {
  return useMutation({
    mutationFn: async ({ password }) => {
      try {
        const res = await axios.post("/api/settings/password/verify", {
          password,
        });
        return res.data;
      } catch (err) {
        const message = err.response?.data;
        throw new Error(message);
      }
    },
    onError: (err) => alert(err),
  });
}
