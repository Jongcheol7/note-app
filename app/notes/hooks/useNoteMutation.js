import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useNoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteData) => {
      axios.post("/api/notes/save", noteData).then((res) => res.data);
    },
    onSuccess: () => {
      // 작성 성공시 노트 캐시를 무효화해서 다시 불러올수 있도록 하자..
      queryClient.invalidateQueries(["noteList"]);
    },
    onError: (err) => console.log("메모 작성 실패 : ", err),
  });
}
