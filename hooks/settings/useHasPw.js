import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useHasPw() {
  return useQuery({
    queryKey: ["hasPw"],
    queryFn: async () => {
      const res = await axios.get("/api/settings/password");
      return res.data;
    },
    select: (data) => data.hasPw,
  });
}
