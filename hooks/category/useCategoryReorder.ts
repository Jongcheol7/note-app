import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface CategoryReorderItem {
  categoryNo: number;
  sortOrder: number;
}

export function useCategoryReorder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: CategoryReorderItem[]) => {
      try {
        return axios
          .post("/api/category/reorder", category)
          .then((res) => res.data);
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<string>;
        const message = axiosErr.response?.data;
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: Error) => alert(err.message),
  });
}
