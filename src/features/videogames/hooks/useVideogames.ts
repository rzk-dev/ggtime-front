import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchVideogames } from "../api/videogamesApi";

const PAGE_SIZE = 50
export function useVideogames() {
  const query = useInfiniteQuery({
    queryKey: ["videogames"],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const data = await fetchVideogames(PAGE_SIZE, pageParam);

      return data;
    }, getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE
        ? undefined
        : allPages.length * PAGE_SIZE,
  });

  return {
    ...query,
    games: query.data?.pages.flat() ?? [],
  };
}
