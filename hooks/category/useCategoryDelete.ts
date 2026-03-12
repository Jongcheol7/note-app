import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface CategoryDeletePayload {
  categoryNo: number;
}

export function useCategoryDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryNo: CategoryDeletePayload) => {
      try {
        // delete 은 data 를 키값으로 던져야함.
        const res = await axios.delete("/api/category/save", {
          data: categoryNo,
        });
        return res.data;
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<string>;
        const message = axiosErr.response?.data;
        throw new Error(message);
      }
    },
    onSuccess: () => {
      alert("삭제완료 했습니다.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: Error) => alert(err.message),
  });
}
