/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {LoginForm} from "./login/LoginForm";
import {createAppContainer, createStackNavigator} from 'react-navigation';
import {DetailedMovieView} from "./movie/DetailedMovieView";
import {MovieListWrapper} from "./movie/MovieListWrapper";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

const paramsToProps = (SomeComponent) => {
// turns this.props.navigation.state.params into this.params.<x>
    return class extends React.Component {
        static navigationOptions = SomeComponent.navigationOptions;
        // everything else, call as SomeComponent
        render() {
            const {navigation, ...otherProps} = this.props
            const {state: {params}} = navigation
            return <SomeComponent {...this.props} {...params} />
        }
    }
};

export const AppNavigation = createStackNavigator({
    LoginScreen: {screen:LoginForm},
    MoviesScreen:  {screen:paramsToProps(MovieListWrapper)},
    DetailedMovieScreen: {screen:paramsToProps(DetailedMovieView)}
});

const AppContainer = createAppContainer(AppNavigation);

type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <AppContainer/>
        );
    }
}







