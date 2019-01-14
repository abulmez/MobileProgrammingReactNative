import {StyleSheet, Button, TextInput, View, AsyncStorage} from "react-native";
import React, {Component} from 'react';
import {httpApiUrl} from "../core/api";
import {OfflineBanner} from "../core/offlineBanner";


export class DetailedMovieView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            movie: null,
            name: '',
            releaseYear: '',
            rating: '',
            isOfflineMode: false
        };

    }

    componentDidMount() {
        const {navigation} = this.props;
        const movie = navigation.getParam('movie');
        this.state.movie = movie;
        this.setState({
            name:movie.name,
            releaseYear:movie.releaseYear,
            rating:movie.rating.toString()
        });
        this.retrieveDataFromAsyncStorage('offlineMode').then((isOfflineMode) => {
            if (isOfflineMode === 'true') {
                this.setState({'isOfflineMode': true});
            } else {
                this.setState({'isOfflineMode': false});
            }
        })
    }

    render() {

        return (

            <View style={styles.container}>
                {OfflineBanner.renderIf(this.state.isOfflineMode,
                    <OfflineBanner />
                )}
                <TextInput
                    onChangeText = {(text) => this.setState({name:text})}
                    style={styles.textField}
                    value={this.state.name}
                    placeholder={'Name'}
                />
                <TextInput
                    onChangeText={(text) => this.setState({releaseYear:text})}
                    style={styles.textField}
                    value={this.state.releaseYear}
                    placeholder={'Release year'}
                />
                <TextInput
                    onChangeText={(text) => this.setState({rating:text})}
                    style={styles.textField}
                    value={this.state.rating}
                    placeholder={'Rating'}
                />
                <View style={styles.buttonBundle}>
                    <View style={{flex: 0.05}}/>
                    <View style={styles.buttonWrapper}>
                        <Button
                            style={styles.button}
                            onPress={() => this.cancelHandler()}
                            title="Cancel"
                            color={'#841584'}
                        />
                    </View>
                    <View style={{flex: 0.1}}/>
                    <View style={styles.buttonWrapper}>
                        <Button
                            style={styles.button}
                            onPress={() => this.okHandler()}
                            title="OK"
                            color={'#841584'}
                        />
                    </View>
                    <View style={{flex: 0.05}}/>
                </View>
            </View>
        );
    }

    okHandler = () => {
        this.state.movie.name = this.state.name;
        this.state.movie.releaseYear = this.state.releaseYear;
        this.state.movie.rating = parseFloat(this.state.rating);
        if(this.state.isOfflineMode){
            this.updateMovieOnLocalStorage();
        }
        else{
            this.updateMovieOnServer();
        }
    };

    updateMovieOnServer = () =>{
        this.retrieveDataFromAsyncStorage('token').then((token) => {
            this.setState({isLoading: true});
            fetch(`${httpApiUrl}/movies/update`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(this.state.movie)
            })
                .then(response => {
                    this.updateMovieOnLocalStorage();
                    this.props.navigation.navigate('MoviesScreen');
                })
                .catch(error => {
                    this.setState({isLoading: false});
                    console.log(error);
                });
        }).catch((error) => {
            console.log(error)
        });
    };


    updateMovieOnLocalStorage = () =>{
        this.retrieveDataFromAsyncStorage('movies').then((moviesList)=>{
            moviesList = JSON.parse(moviesList);
            for(let i=0;i<moviesList.length;i++){
                if(moviesList[i].id === this.state.movie.id){
                    moviesList[i] = this.state.movie;
                }
            }
            this.storeDataInAsyncStorage('movies',JSON.stringify(moviesList)).then().catch((error)=>{
                console.log(error);
            });
            this.props.navigation.navigate('MoviesScreen');
        })
    };


    cancelHandler = () => {
        this.props.navigation.goBack();
    };

    retrieveDataFromAsyncStorage = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    storeDataInAsyncStorage = async (key, value) => {
        await AsyncStorage.setItem(key, value);
    };

}


const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        flex: 1
    },

    textField: {
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 4,
        marginRight: 6,
        marginLeft: 6
    },

    button: {
        width: 50,
        height: 50,
    },

    buttonBundle: {
        flex: 1,
        flexDirection: 'row',
        top: '95%'
    },

    buttonWrapper: {
        flex: 0.4
    }
});