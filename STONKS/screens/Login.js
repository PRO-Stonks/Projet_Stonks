import {Formik} from 'formik';
import * as yup from 'yup'
import * as React from 'react';
import {Image, Text, TouchableOpacity, TextInput, View, StyleSheet} from 'react-native';


export default function Login({navigation}) {

    const onLogin = () => {
        const {email, password} = state;
        // TO DO: verify in database
        navigation.navigate('Menu', state.email);
    };

    const loginValidation = yup.object().shape({
        email: yup
            .string()
            .email("Please enter valid email")
            .required('Email Address is Required'),
        password: yup
            .string()
            .min(8, ({min}) => `Password must be at least ${min} characters`)
            .required('Password is required'),
    })


    return (
        <View style={styles.container}>
            <Image
                style={{width: 200, height: 200}}
                source={require('../assets/stonks4.png')}
            />
            <Formik
                validationSchema={loginValidation}
                initialValues={{email: '', password: ''}}
                onSubmit={values => console.log(values)}
            >
                {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      isValid
                  }) => (
                    <>
                        <TextInput
                            name="email"
                            value={values.email}
                            keyboardType='email-address'
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            placeholder='email'
                            placeholderTextColor='black'
                            style={styles.input}
                        />
                        <TextInput
                            name="password"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            placeholder='password'
                            secureTextEntry={true}
                            placeholderTextColor='black'
                            style={styles.input}
                        />
                        {(errors.email && touched.email) &&
                        <Text style={styles.errorText}>{errors.email}</Text>
                        }

                        {(errors.password && touched.password) &&
                        <Text style={styles.errorText}>{errors.password}</Text>
                        }
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                            disabled={!isValid}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>

                    </>
                )}
            </Formik>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#e1663b',
        width: 250,
        height: 44,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    input: {
        width: 250,
        fontSize: 18,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginVertical: 10,
    },
    errorText: {
        fontSize: 10,
        color: 'red',
    },
});

