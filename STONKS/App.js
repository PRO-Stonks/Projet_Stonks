import * as React from 'react';
import {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Button} from "react-native";

import Login from './screens/Login.js';
import Menu from './screens/Menu.js';
import Scan from './screens/Scan.js';
import {UserContext} from './UserContext'


/*
Créer le stack screen et définit le header pour les screens
! une fois loggé on peut plus revenir en arrière
              headerLeft: null,
              gestureEnabled: false,
 */


function StackScreen() {
    /**
     * User state to see if a user is logged
     */
    const [state, setState] = useState({loggedIn: false, user: {}, token: ""});

    /**
     * Function to set the user state
     * @param state
     */
    const setUserData = (state) => {
        setState(state);
    };

    /**
     * To pass user state and function to set it to another component
     * @type {{state: {loggedIn: boolean, user: {}, token: string}, setUserData: setUserData}}
     */
    const tokenHandler = {
        state,
        setUserData
    }

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //         const tokenArray = token.split('.');
    //         const payload = JSON.parse(atob(tokenArray[1]));
    //         const current_time = Date.now().valueOf() / 1000;
    //         if(payload.exp < current_time){
    //             localStorage.removeItem("token");
    //             localStorage.removeItem("user");
    //         }else{
    //             setState(
    //                 {
    //                     token,
    //                     user: JSON.parse(localStorage.getItem("user")),
    //                     loggedIn: true
    //                 }
    //             )
    //         }
    //     }
    // }, []);

    /**
     * Define app screens in a Stack navigator
     * to add later:
     * headerLeft: null,
     * gestureEnabled: false,
     */
    return (
        <UserContext.Provider value={tokenHandler}>
            <Stack.Navigator initialRouteName="Login"
                             screenOptions={{
                                 headerStyle: {
                                     backgroundColor: '#ffe385',
                                 },
                                 headerTintColor: 'black',
                                 headerTitleStyle: {
                                     fontWeight: 'bold',
                                 },
                             }}
            >
                <Stack.Screen name="Login" component={Login}/>

                <Stack.Screen name="Menu" component={Menu} options={{
                    headerRight: () => (
                        <Button
                            onPress={() => alert('Logout button')}
                            title="Logout"
                            color="black"
                        />
                    ),
                }}
                >
                </Stack.Screen>
                <Stack.Screen name="Scan" component={Scan}/>

            </Stack.Navigator>
        </UserContext.Provider>
    );
}

const Stack = createStackNavigator();

/**
 * Main
 */
export default class App extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <StackScreen/>
            </NavigationContainer>
        );
    }
}


