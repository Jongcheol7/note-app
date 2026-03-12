import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface NoteData {
  no?: number;
  title: string;
  content?: string;
  categoryNo?: number;
  color?: string;
  isPublic?: boolean;
  isSecret?: boolean;
  alarmDatetime?: string | null;
}

export function useNoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteData: NoteData) => {
      return axios.post("/api/notes/save", noteData).then((res) => res.data);
    },
    onSuccess: () => {
      // 작성 성공시 노트 캐시를 무효화해서 다시 불러올수 있도록 하자..
      queryClient.invalidateQueries({ queryKey: ["noteLists"] });
      queryClient.invalidateQueries({ queryKey: ["noteDetail"] });
    },
    onError: (err: Error) => console.error("메모 작성 실패:", err),
  });
}
