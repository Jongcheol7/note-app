import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface CategoryPayload {
  categoryNo?: number;
  categoryName: string;
}

export function useCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: CategoryPayload) => {
      try {
        return axios
          .post("/api/category/save", category)
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
