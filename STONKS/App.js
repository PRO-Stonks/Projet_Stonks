import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from "react-native";

import Login from './screens/Login.js';
import Menu from './screens/Menu.js';
import Scan from './screens/Scan.js';
import {useEffect, useState} from "react";


/*
Créer le stack screen et définit le header pour les screens
! une fois loggé on peut plus revenir en arrière
              headerLeft: null,
              gestureEnabled: false,
 */
function StackScreen() {
    const [state, setState] = useState({loggedIn: false, user: {}, token: ""});
    const handleChange = e => {
        console.log(e)
        setState(e);
        //
        // localStorage.setItem("token", e.token);
        // localStorage.setItem("user", JSON.stringify(e.user));
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
  return (
      <Stack.Navigator initialRouteName="Login"
          screenOptions={{
              headerStyle: {
                  backgroundColor : '#ffe385',
              },
              headerTintColor: 'black',
              headerTitleStyle : {
                  fontWeight: 'bold',
              },
          }}
      >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Menu" component={Menu} options={{
              headerRight: () => (
                  <Button
                      onPress={() => alert('Logout button')}
                      title="Logout"
                      color="black"
                  />
              ),
          }} initialParams={state.token}
          />
          <Stack.Screen name="Scan" component={Scan} />
      </Stack.Navigator>
  );
}


const Stack = createStackNavigator();

export default class App extends React.Component {
  render () {
    return (
        <NavigationContainer>
            <StackScreen/>
        </NavigationContainer>
    );
  }
}


