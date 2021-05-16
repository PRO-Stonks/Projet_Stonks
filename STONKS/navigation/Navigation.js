import * as React from 'react';
import {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Button} from "react-native";
import Login from '../screens/Login.js';
import Menu from '../screens/Menu.js';
import Add from '../screens/Add.js';
import Info from '../screens/Info.js';
import DisplayInfo from '../screens/DisplayInfo.js'
import Delete from '../screens/Delete';
import {UserContext} from '../UserContext'

export default function StackScreen() {
    // state to store user info
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
     * Define the app screens in a Stack navigator
     * remove if you want to scroll back to Login:
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
                    headerLeft: null,
                    gestureEnabled: false,
                }}
                >
                </Stack.Screen>
                <Stack.Screen name="Add" component={Add}/>
                <Stack.Screen name="Scan for info" component={Info}/>
                <Stack.Screen name="Info" component={DisplayInfo}/>
                <Stack.Screen name="Scan for delete" component={Delete}/>

            </Stack.Navigator>
        </UserContext.Provider>
    );
}

const Stack = createStackNavigator();
