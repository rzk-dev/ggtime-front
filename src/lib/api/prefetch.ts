// api/prefetch.ts
import { QueryClient } from '@tanstack/react-query';
import { getAllGenres } from './genreApi';
import { getAllPlatforms } from './platformApi';
import { getAllLanguages } from './languageApi';
import { getUserPreferences } from './userApi';

export async function prefetchAppData(queryClient: QueryClient, token: string) {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['genres'],
      queryFn: () => getAllGenres(token),
    }),
    queryClient.prefetchQuery({
      queryKey: ['platforms'],
      queryFn: () => getAllPlatforms(token),
    }),
    queryClient.prefetchQuery({
      queryKey: ['languages'],
      queryFn: () => getAllLanguages(token),
    }),
    queryClient.prefetchQuery({
        queryKey:['user'],
        queryFn: () => getUserPreferences(token),
    }),
  ]);
}