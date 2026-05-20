import { getAllPlatforms } from "@/src/lib/api/platformApi";
import { useQuery } from "@tanstack/react-query";

function useGetPlatforms(auth_token: string) {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: () => getAllPlatforms(auth_token),
  });
}
export default useGetPlatforms;

/* ************************************************************************
******************* EJEMPLO DE USO EN COMPONENTE **************************
    import { FlatList, Text, ActivityIndicator } from 'react-native';
    import useGetPlatforms from '../hooks/useGetPlatforms';

    function PlatformsList({ auth_token }: { auth_token: string }) {
    const { data, isPending, error } = useGetPlatforms(auth_token);

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
export default PlatformsList;
*********************************************************************** */