// 해당 훅은 서버에 있는 메모리스트를 React Query 로 가져오도록 한다.
"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function useNoteLists({ menuFrom, keyword, categoryName }) {
  // 가장 최신 버전 (커서 방식)

  return useInfiniteQuery({
    queryKey: ["noteLists", keyword, menuFrom, categoryName],
    queryFn: async ({ pageParam = null }) => {
      const res = await axios.get("/api/notes", {
        params: {
          cursor: pageParam,
          limit: 10,
          keyword,
          menuFrom,
          categoryName,
        },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null,
  });
}
