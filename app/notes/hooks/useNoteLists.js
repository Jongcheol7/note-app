// 해당 훅은 서버에 있는 메모리스트를 React Query 로 가져오도록 한다.
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useNoteLists() {
  return useQuery({
    queryKey: ["noteLists"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/notes");
        return res.data;
      } catch (err) {
        // 👇 여기서 라우트에서 보낸 메시지를 직접 추출해서 에러로 던져줌
        const message = err.response?.data ?? err.message;
        throw new Error(message);
      }
    },
    // 3분으로 설정. 대신 나중에 3분안에 누가 글쓰면 수동갱신 작업이 필요
    staleTime: 1000 * 60 * 3,
  });
}
