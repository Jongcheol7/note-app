import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface AlarmMutationParams {
  date: string;
  no: number;
}

export function useAlarmMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, no }: AlarmMutationParams) => {
      try {
        const res = await axios.patch(`/api/calendar`, {
          date,
          no,
        });
        return res.data;
      } catch (err: unknown) {
        const axiosErr = err as import("axios").AxiosError<string>;
        const message = axiosErr.response?.data;
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noteLists"] });
      queryClient.invalidateQueries({ queryKey: ["noteDetail"] });
      toast.success("날짜 설정완료");
    },
    onError: (err) => toast.error("날짜 설정에 실패했습니다. " + err.message),
  });
}
