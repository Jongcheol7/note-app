// 해당 훅은 서버에 있는 메모리스트를 React Query 로 가져오도록 한다.
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useNoteLists() {
  return useQuery({
    queryKey: ["noteLists"],
    queryFn: async () => {
      // 서버에 GET 요청으로 데이터 가져오자.
      const res = await axios.get("/api/note");
      // 가져온 데이터를 배열로 반환하자.
      return res.data;
    },
    // 3분으로 설정. 대신 나중에 3분안에 누가 글쓰면 수동갱신 작업이 필요
    staleTime: 1000 * 60 * 3,
  });
}
