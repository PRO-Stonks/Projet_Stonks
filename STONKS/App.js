import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackScreen from './navigation/Navigation.js';

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


