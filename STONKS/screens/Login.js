import {Formik} from 'formik';
import * as yup from 'yup'
import * as React from 'react';
import {Image, Text, TouchableOpacity, TextInput, View, StyleSheet} from 'react-native';


export default function Login({navigation}) {

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


    async function getData(url, data){
        try{
            const response = await fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            });
            let res = response.json();
            console.log(response.json());
            if (res.status === 'fail'){
                return res;
            }
        }catch (e){
            console.log("Error")
            console.log(e);
        }
    }

    return (
        <View style={styles.container}>
            <Image
                style={{width: 200, height: 200}}
                source={require('../assets/stonks4.png')}
            />
            <Formik
                validationSchema={loginValidation}
                initialValues={{email: '', password: ''}}
                onSubmit={async values => {
                    const res = await getData("http://192.168.0.59:4000/api/v1/users/login", values);
                    alert(JSON.stringify(res, null, 2));
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

