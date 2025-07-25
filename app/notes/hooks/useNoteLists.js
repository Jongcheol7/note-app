// 해당 훅은 서버에 있는 메모리스트를 React Query 로 가져오도록 한다.
"use client";
import { useFromStore } from "@/store/useFromStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useNoteLists() {
  // 가장 최신 버전 (커서 방식)
  const { keyword } = useSearchStore();
  const { menuFrom } = useFromStore();
  return useInfiniteQuery({
    queryKey: ["noteLists", keyword],
    queryFn: async ({ pageParam = null }) => {
      const res = await axios.get("/api/notes", {
        params: { cursor: pageParam, limit: 10, keyword, menuFrom },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null,
  });

  // 무한스크롤 설명..
  // useQuery => useInfiniteQuery 로 변경
  // queryKey 는 동일
  // queryFn 에 getNextPageParam에서 리턴한 값을 자동으로 파람으로 전달받는다.
  // getNextPageParam에서는 마지막페이지와, 지금까지 받아온페이지 배열을 파람으로 두고,
  // 마지막페지이에 다음 페이지가 있으면 배열에 1더해서 queryFn 인자로 넘긴다.
  /*
  const { keyword } = useSearchStore();
  const { menuFrom } = useFromStore();
  return useInfiniteQuery({
    queryKey: ["noteLists", keyword],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get(
        `/api/notes?page=${pageParam}&keyword=${keyword}&menuFrom=${menuFrom}`
      );
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasNextPage) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
  */
}
