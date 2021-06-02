import {Formik} from 'formik';
import * as yup from 'yup'
import * as React from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import API_URL from "../utils/url";
import {UserContext} from "../utils/UserContext";
import verifyUser from '../request/verifyUser.js';
import styles from '../styles/LoginStyle';

/**
 * Login component displaying the Login view and handling user login
 * @param props: properties to hold navigator
 * @returns {JSX.Element} Login view
 */
const Login = (props) => {

    /**
     * Form validation using yup
     */
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

    /**
     * Login view using Formik
     */
    return (
        <UserContext.Consumer>
            {({setUserData}) => (
                <View style={styles.container}>
                    <Image
                        style={{width: 200, height: 200}}
                        source={require('../assets/stonks4.png')}
                    />
                    <Formik
                        validationSchema={loginValidation}
                        initialValues={{email: '', password: ''}}
                        onSubmit={async values => {
                            const res = await verifyUser(API_URL + "users/login", values);
                            if (res.status === 'fail') {
                                alert("Error: invalid credentials")
                            } else {
                                setUserData({loggedIn: true, user: res.data.user, token: res.token})
                                props.navigation.navigate('Menu')
                            }
                        }}
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
            )}
        </UserContext.Consumer>
    );

}

export default Login;
