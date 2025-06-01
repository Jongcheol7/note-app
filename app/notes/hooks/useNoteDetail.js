import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useNoteDetail(no) {
  return useQuery({
    queryKey: ["noteDetail", no],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/notes/${no}`);
        return res.data;
      } catch (err) {
        const message = err.response?.data ?? err.message;
        throw new Error(message);
      }
    },
    enabled: !!no, //참일때만 반환
  });
}
