import { useQuery } from "@tanstack/react-query";
import { fetchPlatforms } from "../api/platformApi";

export function usePlatforms() {
  return useQuery({
    queryKey: ["platforms"],
    queryFn: fetchPlatforms
  })
}
