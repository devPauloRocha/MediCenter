import React from 'react';
import  { createStackNavigator } from '@react-navigation/stack';

import { Welcome } from '../pages/Welcome';
import { UserIdentification } from '../pages/UserIdentification';
import { Confirmation } from '../pages/Confirmation';
import { RemedySave } from '../pages/RemedySave';
import { MyRemedys } from '../pages/MyRemedys';

import colors from '../styles/colors';
import AuthRoutes from './tab.routes';

const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (
    <stackRoutes.Navigator
        headerMode="none"
        screenOptions={{
            cardStyle: {
                backgroundColor: colors.white
            },
        }}
    >
        {/* <stackRoutes.Screen 
            name="RemedySelect"
            component={AuthRoutes}
        /> */}

        <stackRoutes.Screen 
            name="Welcome"
            component={Welcome}
        />

        <stackRoutes.Screen 
            name="UserIdentification"
            component={UserIdentification}
        />

        <stackRoutes.Screen 
            name="Confirmation"
            component={Confirmation}
        />

        <stackRoutes.Screen 
            name="RemedySelect"
            component={AuthRoutes}
        />

        <stackRoutes.Screen 
            name="RemedySave"
            component={RemedySave}
        />

        <stackRoutes.Screen 
            name="MyRemedys"
            component={AuthRoutes}
        />

    </stackRoutes.Navigator>
)


export default AppRoutes;