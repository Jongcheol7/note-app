import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useTrashLists() {
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
}
