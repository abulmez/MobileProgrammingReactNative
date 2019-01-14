import {Consumer} from './context';
import React, {Component} from 'react';
import {ScrollView, ActivityIndicator, View, Text, StyleSheet, AsyncStorage} from 'react-native'
import {MovieListView} from "./MovieListView";
import styles from '../core/style';
import {TouchableHighlight} from 'react-native'
import {OfflineBanner} from "../core/offlineBanner";

export class MovieList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOfflineMode: false
        };
    }

    componentDidMount(): void {
        this.retrieveDataFromAsyncStorage('offlineMode').then((isOfflineMode) => {
            if (isOfflineMode === 'true') {
                this.setState({'isOfflineMode': true});
            } else {
                this.setState({'isOfflineMode': false});
            }
        })

    }

    render() {
        const {navigate} = this.props.navigation;
        return (

            <Consumer>
                {({isLoading, movies}) => (
                    <View style={{flex:1}}>
                        {OfflineBanner.renderIf(this.state.isOfflineMode,
                            <OfflineBanner />
                        )}
                        <ScrollView style={styles.content}>
                            <ActivityIndicator animating={isLoading} style={styles.activityIndicator} size="large"/>
                            {movies && movies.map(movie =>
                                <TouchableHighlight key={movie.id}
                                                    onPress={() => this.openDetailedMovie(navigate, movie)}>
                                    <MovieListView movie={movie}/>
                                </TouchableHighlight>
                            )}
                        </ScrollView>
                    </View>
                )}

            </Consumer>
        );
    }

    retrieveDataFromAsyncStorage = async (key) => {
        return await AsyncStorage.getItem(key);
    };


    openDetailedMovie = (navigate, movie) => {
        navigate('DetailedMovieScreen', {'movie': movie});
    };




}


