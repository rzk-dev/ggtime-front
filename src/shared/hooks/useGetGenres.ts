import { getAllGenres } from '@/src/lib/api/genreApi';
import { useQuery } from '@tanstack/react-query';

function useGetGenres(auth_token: string) {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => getAllGenres(auth_token!),
    enabled: !!auth_token,
  });
}

export default useGetGenres;

/* ************************************************************************
******************* EJEMPLO DE USO EN COMPONENTE **************************

    import { FlatList, Text, ActivityIndicator } from 'react-native';
    import useGetGenres from '../hooks/useGetGenres';

    function GenresList({ auth_token }: { auth_token: string }) {
    const { data, isPending, error } = useGetGenres(auth_token);

    if (isPending) return <ActivityIndicator />;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        />
    );
    }

export default GenresList;
*********************************************************************** */