import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useTrashLists() {
  /*
  return useQuery({
    queryKey: ["trashLists"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/notes/trash");
        return res.data;
      } catch (err) {
        const message = err.response?.data ?? err.message;
        throw new Error(message);
      }
    },
  });
  */

  // 노트 리스트처럼 동일하게 무한스크롤로 만들어보자
  return useInfiniteQuery({
    queryKey: ["trashLists"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await axios.get(`/api/notes/trash?page=${pageParam}`);
        return res.data;
      } catch (err) {
        const message = err.response?.data ?? err.message;
        throw new Error(message);
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasNextPage) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
}
