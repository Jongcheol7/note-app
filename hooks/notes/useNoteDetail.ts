import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export function useNoteDetail(no: number | null, menuFrom: string) {
  return useQuery({
    queryKey: ["noteDetail", no],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/notes/${no}`, {
          params: { menuFrom },
        });
        return res.data;
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<string>;
        const message = axiosErr.response?.data ?? axiosErr.message;
        throw new Error(message);
      }
    },
    enabled: !!no,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
