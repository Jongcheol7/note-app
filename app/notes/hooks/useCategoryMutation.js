import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category) => {
      return axios
        .post("/api/notes/category/save", category)
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (err) => console.log("카테고리 저장 실패 : ", err),
  });
}
