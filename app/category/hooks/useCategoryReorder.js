import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useCategoryReorder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category) => {
      try {
        return axios
          .post("/api/category/reorder", category)
          .then((res) => res.data);
      } catch (err) {
        const message = err.response?.data;
        throw new Error(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (err) => alert(err.response?.data),
  });
}
