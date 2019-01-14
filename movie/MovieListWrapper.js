import React, {Component} from 'react';
import MovieStore from "./MovieStore";
import {MovieList} from "./MovieList";


export class MovieListWrapper extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MovieStore>
                <MovieList {...this.props}/>
            </MovieStore>
        )
    }

    componentDidMount(): void {
        const {navigation} = this.props;
        navigation.addListener ('willFocus', () =>{
            this.forceUpdate();
        });
    }
}

