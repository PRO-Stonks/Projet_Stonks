import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Login } from './screens/Login.js';
import Menu from './screens/Menu.js';
import Scan from './screens/Scan.js';


function StackScreen() {
  return (
      <Stack.Navigator initialRouteName="Login"
          screenOptions={{
              headerStyle: {
                  backgroundColor : 'orange',
              },
              headerTitleStyle : {
                  fontWeight: 'bold',
              },
          }}
      >
          <Stack.Screen
              name="Login"
              component={Login}
        />
        <Stack.Screen name="Menu" component={Menu} />
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


