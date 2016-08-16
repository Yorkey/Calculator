/**
 * Created by wangyu on 2016/4/29.
 */
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

export default class HorizontailLine extends Component {

    render() {
        return (
            <View style={[styles.horizontalLine, this.props.style]} />
        );
    }
}

const styles = StyleSheet.create({
    horizontalLine: {
        backgroundColor: '#dfdfdf',
        height: StyleSheet.hairlineWidth,
    },
});