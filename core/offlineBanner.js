import {View, Text} from "react-native";
import React, {Component} from 'react';

import styles from "./style";


export class OfflineBanner extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View style={styles.offlineModeBanner}>
                <Text style={{textAlign: 'center'}}>- - - - - - - Offline mode - - - - - - -</Text>
            </View>
        );
    }

    static renderIf(condition, content) {
        if (condition) {
            return content;
        } else {
            return null;
        }
    }




}
