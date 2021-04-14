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

    const handleChange = (e) => { // help
        console.log("FDKGÉLDSGLÉDSKGRS")
        setState(e);
        state.user = JSON.stringify(e.user);
        state.token = e.token;
        console.log({state})

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
          <Stack.Screen name="Menu"  options={{
              headerRight: () => (
                  <Button
                      onPress={() => alert('Logout button')}
                      title="Logout"
                      color="black"
                  />
              ),
          }}
          >
              {props => <Menu {...props} extraData={state.token} />} 
          </Stack.Screen>
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


