import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCategoryLists() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        return await axios.get("/api/category").then((res) => res.data);
      } catch (err) {
        const message = err.response?.data || "에러발생!";
        throw new Error(message);
      }
    },
  });
}
