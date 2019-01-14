import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';

export class MovieListView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.item}>
                <Text style={[styles.titleText, styles.text]}>{this.props.movie.name}</Text>
                <Text style={styles.text}>Release year: {this.props.movie.releaseYear}</Text>
                <Text style={styles.text}>Rating: {this.props.movie.rating}</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'coral',
        borderRadius: 10,
        margin: 4
    },

    titleText: {
        fontWeight: 'bold',
        fontSize: 18,
    },

    text: {
        margin: 10
    }

});