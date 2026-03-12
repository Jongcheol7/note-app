import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface HasPwResponse {
  hasPw: boolean;
}

export function useHasPw() {
  return useQuery<HasPwResponse, Error, boolean>({
    queryKey: ["hasPw"],
    queryFn: async (): Promise<HasPwResponse> => {
      const res = await axios.get("/api/settings/password");
      return res.data;
    },
    select: (data: HasPwResponse) => data.hasPw,
  });
}
