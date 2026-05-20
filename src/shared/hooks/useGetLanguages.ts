import { getAllLanguages } from "@/src/lib/api/languageApi";
import { useQuery } from "@tanstack/react-query";

function useGetLanguages(auth_token: string) {
    return useQuery({
        queryKey: ['languages'],
        queryFn: () => getAllLanguages(auth_token),
    });
}

export default useGetLanguages;

/* ************************************************************************
******************* EJEMPLO DE USO EN COMPONENTE **************************
    import { FlatList, Text, ActivityIndicator } from 'react-native';
    import useGetLanguages from '../hooks/useGetLanguages';

    function LanguagesList({ auth_token }: { auth_token: string }) {
    const { data, isPending, error } = useGetLanguages(auth_token);

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
export default LanguagesList;
*********************************************************************** */