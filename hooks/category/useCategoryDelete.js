import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useCategoryDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryNo) => {
      try {
        // delete 은 data 를 키값으로 던져야함.
        const res = await axios.delete("/api/category/save", {
          data: categoryNo,
        });
        return res.data;
      } catch (err) {
        const message = err.response?.data;
        throw new Error(message);
      }
    },
    onSuccess: () => {
      alert("삭제완료 했습니다.");
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (err) => alert(err.response?.data),
  });
}
