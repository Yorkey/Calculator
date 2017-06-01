/**
 * Created by wangyu on 2016/4/29.
 */
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

export default class HorizontalMarginLine extends Component {

    static defaultProps = {
        margin: 15,
        backgroundColor: '#fff',
    }

    // 构造
    constructor(props) {
        super(props);

        // 初始状态
        this.state = {};
    }

    render() {
        return (
            <View style={[{backgroundColor: this.props.backgroundColor}, this.props.style]}>
                <View style={[styles.horizontalLine, {marginLeft: this.props.margin}]} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    horizontalLine: {
        backgroundColor: '#dfdfdf',
        height: StyleSheet.hairlineWidth,
    },
});