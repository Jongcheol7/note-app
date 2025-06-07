import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useAlarmMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, no }) => {
      console.log("커스텀훅 date : ", date);
      try {
        const res = await axios.patch(`/api/calendar`, {
          date,
          no,
        });
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
