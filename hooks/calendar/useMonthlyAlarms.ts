import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useMonthlyAlarms(year: number, month: number) {
  return useQuery({
    queryKey: ["monthlyAlarms", year, month],
    queryFn: async () => {
      const res = await axios.get("/api/calendar", {
        params: { year, month },
      });
      return res.data;
    },
    enabled: !!year && !!month,
  });
}
