import React from 'react';
import { Alert, Image, Text, TouchableOpacity, TextInput, View, StyleSheet } from 'react-native';

export class Login extends React.Component {

    state = {
        email: '',
        password: '',
    };

    onLogin() {
        const { email, password } = this.state;
        // TO DO: verify in database
        this.props.navigation.navigate('Menu', email);
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={{ width: 200, height: 200 }}
                    source={require('../assets/stonks4.png')}
                />
                <TextInput
                    value={this.state.email}
                    keyboardType = 'email-address'
                    onChangeText={(email) => this.setState({ email })}
                    placeholder='email'
                    placeholderTextColor = 'black'
                    style={styles.input}
                />
                <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'password'}
                    secureTextEntry={true}
                    placeholderTextColor = 'black'
                    style={styles.input}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.onLogin.bind(this)}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    titleText:{
        fontSize: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'azure',
        width: 250,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText:{
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: 250,
        fontSize: 20,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginVertical: 10,
    },
});

