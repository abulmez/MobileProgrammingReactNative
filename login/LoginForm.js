import React, {Component} from 'react';
import {Alert, TextInput, View, StyleSheet, Button, ActivityIndicator} from "react-native";
import {httpApiUrl, headers} from '../core/api';
import styles from '../core/style';
import {AsyncStorage} from "react-native"
import {NetInfo} from 'react-native';


export class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoading: false
        };
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={pageStyles.loginForm}>
                <ActivityIndicator animating={this.state.isLoading} style={styles.activityIndicator} size="large"/>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({username: text})}
                    placeholder={'Username'}
                    value={this.state.username}
                />
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({password: text})}
                    secureTextEntry={true}
                    placeholder={'Password'}
                    value={this.state.password}
                />
                <Button
                    onPress={() => this.onLogin(navigate)}
                    title="Login"
                    color="#841584"
                />
            </View>


        );
    }

    storeDataInAsyncStorage = async (key, value) => {
        await AsyncStorage.setItem(key, value);
    };

    retrieveDataFromAsyncStorage = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    onLogin = (navigate) => {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.onlineLogin(navigate);
            } else {
                this.offlineLogin(navigate);
            }
        });

    };

    onlineLogin = (navigate) => {
        this.setState({isLoading: true});
        fetch(`${httpApiUrl}/login`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
        }).then(response => {
            const headers = response.headers;
            this.storeDataInAsyncStorage('token', headers.get("Authorization")).then().catch((error) => {
                console.log(error)
            });
            return Promise.all([response.status])
        }).then(([status]) => {
            this.setState({isLoading: false});
            if (parseInt(status, 10) === 200) {
                this.storeDataInAsyncStorage('offlineMode', 'false').then().catch((error) => {
                    console.log(error)
                });
                this.storeDataInAsyncStorage('lastLoggedUser', JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })).then().catch((error) => {
                    console.log(error)
                });
                navigate('MoviesScreen');
            } else {
                Alert.alert("Invalid authentication data!")
            }

        })
            .catch(error => {
                this.setState({isLoading: false});
                this.offlineLogin(navigate);
                console.log(error);
            });
    };

    offlineLogin = (navigate) => {
        this.retrieveDataFromAsyncStorage('lastLoggedUser').then((lastLoggedUser) => {
            if (lastLoggedUser == null) {
                Alert.alert("Invalid authentication data!");
            } else {
                lastLoggedUser = JSON.parse(lastLoggedUser);
                if (this.state.username === lastLoggedUser.username && this.state.password === lastLoggedUser.password) {
                    this.storeDataInAsyncStorage('offlineMode', 'true').then().catch((error) => {
                        console.log(error);
                    });
                    navigate('MoviesScreen');
                } else {
                    Alert.alert("Invalid authentication data!");
                }
            }
        })
    }
}

const pageStyles = StyleSheet.create({
    loginForm: {
        marginTop: 250,
        marginRight: 20,
        marginLeft: 20
    }
});