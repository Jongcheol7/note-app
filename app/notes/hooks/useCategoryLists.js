import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCategoryLists() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await axios.get("/api/notes/category").then((res) => res.data);
    },
  });
}
