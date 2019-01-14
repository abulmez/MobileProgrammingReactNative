import {httpApiUrl} from '../core/api';
import React, {Component} from 'react';
import {Provider} from './context';
import {LoginForm} from "../login/LoginForm";
import {Alert, AsyncStorage} from "react-native"

class MovieStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            notes: null,
        };
    }

    componentDidMount() {
        this.loadMovies();
    }

    componentWillUnmount() {
    }

    loadMovies = () => {

        this.retrieveDataFromAsyncStorage('offlineMode').then((isOffline) => {
            if (isOffline === 'true') {
                this.loadMoviesFromLocalStorage();
            } else {
                this.loadMoviesFromServer();
            }
        });

    };

    loadMoviesFromServer = () => {
        this.retrieveDataFromAsyncStorage('token').then((token) => {
            this.setState({isLoading: true});
            fetch(`${httpApiUrl}/movies`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            })
                .then(response => response.json())
                .then(json => {
                    this.checkIfSyncNeeded(json);
                })
                .catch(error => {
                    this.setState({isLoading: false});
                    console.log(error);
                });
        }).catch((error) => {
            console.log(error)
        });
    };

    checkIfSyncNeeded = (serverMovies) => {
        this.retrieveDataFromAsyncStorage('movies').then((localMovies) => {
            localMovies = JSON.parse(localMovies);
            let isSyncNeeded = false;
            if (serverMovies == null && localMovies == null) {
                isSyncNeeded = false;
            } else if (serverMovies == null && localMovies != null || localMovies == null && serverMovies != null) {
                isSyncNeeded = true;
            } else if (serverMovies.length !== localMovies.length) {
                isSyncNeeded = true;
            } else {
                for (let i = 0; i < serverMovies.length; i++) {
                    const serverMovie = serverMovies[i];
                    const localMovie = localMovies[i];
                    if (serverMovie.id !== localMovie.id
                        || serverMovie.name !== localMovie.name
                        || serverMovie.releaseYear !== localMovie.releaseYear
                        || serverMovie.rating !== localMovie.rating) {
                        isSyncNeeded = true;
                        break;
                    }
                }
            }
            if(isSyncNeeded){
                this.syncIsNeeded(serverMovies,localMovies);
            }
            else{
                this.setState({isLoading: false, movies: serverMovies});
            }
        })
    };

    syncIsNeeded = (serverMovies,localMovies) =>{
        Alert.alert(
            'Important!',
            'Local data is different from the server data.',
            [
                {text: 'Keep local data', onPress: () => {
                        serverMovies = localMovies;
                        this.replaceServerMovieList(localMovies);

                    }},
                {text: 'Keep server data', onPress: () => {
                        this.storeDataInAsyncStorage('movies', JSON.stringify(serverMovies)).then(()=>{
                            this.setState({isLoading: false, movies: serverMovies});
                        }).catch((error) => {
                            console.log(error)
                        });
                    }},
            ],
            { cancelable: false }
        )
    };

    replaceServerMovieList = (newMovieList) => {
        this.retrieveDataFromAsyncStorage('token').then((token) => {
            this.setState({isLoading: true});
            fetch(`${httpApiUrl}/movies/replaceAll`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(newMovieList)
            })
                .then(()=>{
                    this.setState({isLoading: false, movies: newMovieList});
                })
                .catch(error => {
                    this.setState({isLoading: false});
                    console.log(error);
                });
        }).catch((error) => {
            console.log(error)
        });
    };

    loadMoviesFromLocalStorage = () => {
        this.setState({isLoading: true});
        this.retrieveDataFromAsyncStorage('movies').then((moviesList) => {
            if (moviesList != null) {
                moviesList = JSON.parse(moviesList);
                this.setState({isLoading: false, movies: moviesList});
            } else {
                this.setState({isLoading: false});
                Alert.alert("Local storage is empty.");
            }
        })
    };

    render() {
        return (
            <Provider value={this.state}>
                {this.props.children}
            </Provider>
        );
    }

    retrieveDataFromAsyncStorage = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    storeDataInAsyncStorage = async (key, value) => {
        await AsyncStorage.setItem(key, value);
    };
}

export default MovieStore;