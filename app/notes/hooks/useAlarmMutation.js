import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useAlarmMutation() {
  return useMutation({
    mutationFn: async ({ date, no }) => {
      try {
        const res = await axios.patch(`/api/notes/${no}/alarm`, { date });
        return res.data;
      } catch (err) {
        const message = err.response?.data;
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["noteList"]);
      queryClient.invalidateQueries(["noteDetail"]);
    },
    onError: (err) => alert(err),
  });
}
