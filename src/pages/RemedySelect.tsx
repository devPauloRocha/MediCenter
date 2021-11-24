import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { EnviromentButton } from '../components/EnviromentButton';
import { useNavigation } from '@react-navigation/core';

import { Header } from '../components/Header';
import { RemedyCardPrimary } from '../components/RemedyCardPrimary';
import { Load } from '../components/Load';
import { RemedyProps } from '../libs/storage';

import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnviromentProps {
    key: string;
    title: string;
}

export function RemedySelect(){
    const [enviroments, setEnvirtoments] = useState<EnviromentProps[]>([]);
    const [remedys, setRemedys] = useState<RemedyProps[]>([]);
    const [filteredRemedys, setFilteredRemedys] = useState<RemedyProps[]>([]);
    const [enviromentSelected, setEnviromentSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);    

    const navigation = useNavigation();

    function handleEnrivomentSelected(environment: string){
        setEnviromentSelected(environment);

        if(environment == 'all')
            return setFilteredRemedys(remedys);
        
        const filtered = remedys.filter(remedy => 
            remedy.environments.includes(environment)
        );

        setFilteredRemedys(filtered);
    }

    async function fetchRemedys(){
        const { data } = await api
        .get(`remedys?_sort=name&_order=asc&_page=${page}&_limit=8`);        

        if(!data)
            return setLoading(true);

        if(page > 1){
            setRemedys(oldValue => [...oldValue, ...data])
            setFilteredRemedys(oldValue => [...oldValue, ...data])
        }else {
            setRemedys(data);
            setFilteredRemedys(data);
        }
        
        setLoading(false);
        setLoadingMore(false);
    }

    function handleFetchMore(distance: number) {
        if(distance < 1)
            return;

        setLoadingMore(true);
        setPage(oldValue => oldValue + 1);
        fetchRemedys();
    }

    function handleRemedySelect(remedy: RemedyProps){
        navigation.navigate('RemedySave', { remedy });
    }


    useEffect(() => {
        async function fetchEnviroment(){
            const { data } = await api
            .get('remedys_environments?_sort=title&_order=asc');
            setEnvirtoments([
                {
                    key: 'all',
                    title: 'Todos',
                },
                ...data
            ]);
        }

        fetchEnviroment();
    },[])

    useEffect(() => {        
        fetchRemedys();
    },[])


    if(loading)
        return <Load />
        
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />

                <Text style={styles.title}>
                    Qual a categoria do 
                </Text>
                <Text style={styles.subtitle}>
                    remedinho que você procura?
                </Text>
            </View>

           <View>
               <FlatList 
                data={enviroments}
                keyExtractor={(item) => String(item.key)}
                renderItem={({ item }) => (
                    <EnviromentButton 
                        title={item.title}
                        active={item.key === enviromentSelected}
                        onPress={() => handleEnrivomentSelected(item.key)}
                        
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.enviromentList}
               />
           </View>

           <View style={styles.remedys}>
               <FlatList 
                data={filteredRemedys}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <RemedyCardPrimary 
                        data={item} 
                        onPress={() => handleRemedySelect(item)}
                    />
                )}
                showsVerticalScrollIndicator={false}
                numColumns={2}   
                onEndReachedThreshold={0.1}                          
                onEndReached={({ distanceFromEnd }) => 
                    handleFetchMore(distanceFromEnd)
                }
                ListFooterComponent={
                    loadingMore 
                    ? <ActivityIndicator color={colors.green} />
                    : <></>
                }
               />

           </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading,
    },
    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32,
        paddingRight: 32
    },
    remedys: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    },
});