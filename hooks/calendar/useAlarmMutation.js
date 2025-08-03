import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function useAlarmMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, no, setShow }) => {
      console.log("커스텀훅 date : ", date);
      try {
        const res = await axios.patch(`/api/calendar`, {
          date,
          no,
        });
        setShow(false);
        return res.data;
      } catch (err) {
        const message = err.response?.data;
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["noteList"]);
      queryClient.invalidateQueries(["noteDetail"]);
      toast.success("날짜 설정완료");
    },
    onError: (err) => toast.error("날짜 설정에 실패했습니다. ", err.message),
  });
}
