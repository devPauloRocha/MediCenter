import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';

export interface RemedyProps {
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
      times: number;
      repeat_every: string;
    };
    hour: string;
    dateTimeNotification: Date;
}

export interface StorageRemedyProps {
    [id: string]: {
        data: RemedyProps;
        notificationId: string;
    }
}

export async function saveRemedy(Remedy: RemedyProps) : Promise<void> {
    try {
        const nexTime = new Date(Remedy.dateTimeNotification);
        const now = new Date();

        const { times, repeat_every } = Remedy.frequency;
        if(repeat_every === 'week'){
            const interval = Math.trunc(7 / times);
            nexTime.setDate(now.getDate() + interval);
        }
        else
            nexTime.setDate(nexTime.getDate() + 1)

        const seconds = Math.abs(
            Math.ceil(now.getTime() - nexTime.getTime()) / 1000);
        
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Olá',
                body: `Está na hora de tomar seu medicamento: ${Remedy.name}`,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data: {
                    Remedy
                },
            },
            trigger: {
                seconds: seconds < 60 ? 60 : seconds,
                repeats: true
            },
        });

        const data = await AsyncStorage.getItem('@Remedymanager:remedys');
        const oldPants = data ? (JSON.parse(data) as StorageRemedyProps) : {};

        const newRemedy = {
            [Remedy.id]: {
                data: Remedy,
                notificationId
            }
        }

        await AsyncStorage.setItem('@remedymanager:remedys', 
        JSON.stringify({
            ...newRemedy,
            ...oldPants
        }));
    }catch (error) {
        throw new Error(error);
    }
}


export async function loadRemedy() : Promise<RemedyProps[]> {
    try {
        const data = await AsyncStorage.getItem('@remedymanager:remedys');
        const remedys = data ? (JSON.parse(data) as StorageRemedyProps) : {};

        const remedysSorted = Object
        .keys(remedys)
        .map((remedy) => {
            return {
                ...remedys[remedy].data,
                hour: format(new Date(remedys[remedy].data.dateTimeNotification), 'HH:mm')
            }
        })
        .sort((a, b) => 
            Math.floor(
                new Date(a.dateTimeNotification).getTime() / 1000 -
                Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
            )
       );

       return remedysSorted;

    }catch (error) {
        throw new Error(error);
    }
}

export async function removeRemedy(id: string): Promise<void> {
    const data = await AsyncStorage.getItem('@remedymanager:remedys');
    const remedys = data ? (JSON.parse(data) as StorageRemedyProps) : {};

    await Notifications.cancelScheduledNotificationAsync(remedys[id].notificationId);
    delete remedys[id];

    await AsyncStorage.setItem(
        '@remedymanager:remedys',
        JSON.stringify(remedys)
    );
}