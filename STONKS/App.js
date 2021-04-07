import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Login } from './screens/Login.js';
import Menu from './screens/Menu.js';
import Scan from './screens/Scan.js';
import {Button} from "react-native";

/*
Créer le stack screen et définit le header pour les screens
! une fois loggé on peut plus revenir en arrière
 */
function StackScreen() {
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
              headerLeft: null,
              gestureEnabled: false,
              headerRight: () => (
                  <Button
                      onPress={() => alert('Logout button')}
                      title="Logout"
                      color="black"
                  />
              ),
          }}
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

