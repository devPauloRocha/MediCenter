import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    Alert
} from 'react-native';

import { Header } from '../components/Header';

import waterdrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import { RemedyProps, loadRemedy, removeRemedy } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { RemedyCardSecondary } from '../components/RemedyCardSecondary';
import { Load } from '../components/Load';

export function MyRemedys() {
    const [myRemedys, setMyRemedys] = useState<RemedyProps[]>([]);
    const [loading, setLoading] = useState(true);    
    const [nextWaterd, setNextWatered] = useState<string>();

    function handleRemove(remedy: RemedyProps) {
        Alert.alert('Remover', `Deseja remover a ${remedy.name}?`,[
            {
                text: 'Não 🙏🏼',
                style: 'cancel'
            },
            {
                text: 'Sim 🥲',
                onPress: async () => {
                    try {
                        await removeRemedy(remedy.id);
                        setMyRemedys((oldData) => 
                            oldData.filter((item) => item.id !== remedy.id)
                        );                        
                    } catch (error) {
                        Alert.alert('Não foi possível remover! 🥲');
                    }
                }
            }
        ])
        
    }

    useEffect(() => {
        async function loadStorageData() {
            const remedysStoraged = await loadRemedy();

            const nextTime = formatDistance(
                new Date(remedysStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: pt }
            );

            setNextWatered(
                `Não esqueça de tomar o medicamento: ${remedysStoraged[0].name} à ${nextTime} horas.`
            ) 
            
            setMyRemedys(remedysStoraged);
            setLoading(false);
        }

        loadStorageData();
    },[])


    if(loading)
        return <Load />

    return (
        <View style={styles.container}>
            <Header/>

            <View style={styles.spotlight}>
                <Image 
                    source={waterdrop}
                    style={styles.spotlightImage}
                />
                <Text style={styles.spotlightText}>
                    {nextWaterd}
                </Text>
            </View>

            <View style={styles.remedys}>
                <Text style={styles.remedysTitle}>
                    Remedios Agendados
                </Text>

                <FlatList 
                    data={myRemedys}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                       <RemedyCardSecondary 
                            data={item} 
                            handleRemove={() => {handleRemove(item)}}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotlight: {
     backgroundColor: '#FFF6B3',
     paddingHorizontal: 20,
     borderRadius: 20,
     height: 110,
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center'
    },
    spotlightImage: {
        width: 60,
        height: 60
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },
    remedys: {
        flex: 1,
        width: '100%'
    },
    remedysTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }
});