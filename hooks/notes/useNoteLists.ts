"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

interface UseNoteListsParams {
  menuFrom: string;
  keyword: string;
  categoryName: string;
}

interface Note {
  noteNo: number;
  title: string;
  content: string;
  plainText: string;
  modDatetime: string;
  color: string | null;
  isPinned: boolean;
  isPublic: boolean;
  isSecret: boolean;
  delDatetime: string | null;
  _count: { likes: number };
  likes: { userId: string }[];
  [key: string]: unknown;
}

interface NoteListPage {
  notes: Note[];
  nextCursor: number | null;
}

export function useNoteLists({ menuFrom, keyword, categoryName }: UseNoteListsParams) {
  return useInfiniteQuery<NoteListPage>({
    queryKey: ["noteLists", keyword, menuFrom, categoryName],
    queryFn: async ({ pageParam = null }): Promise<NoteListPage> => {
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
    getNextPageParam: (lastPage: NoteListPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });
}
