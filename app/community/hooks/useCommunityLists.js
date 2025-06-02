import { useSearchStore } from "@/store/SearchStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCommunityLists() {
  const { keyword } = useSearchStore();
  return useInfiniteQuery({
    queryKey: ["communitylists", keyword],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get(
        `/api/community?page=${pageParam}&keyword=${keyword}`
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
}
