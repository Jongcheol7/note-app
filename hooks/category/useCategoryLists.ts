import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface Category {
  categoryNo: number;
  name: string;
  sortOrder: number;
}

export function useCategoryLists() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        return await axios.get("/api/category").then((res) => res.data);
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<string>;
        const message = axiosErr.response?.data || "에러발생!";
        throw new Error(message);
      }
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}
