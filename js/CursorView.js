/**
 * Created by wangyu on 2017/6/1.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

export default class CursorView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: true,
        };
    }

    componentDidMount() {
        this.cursorTimer = setInterval(() => {
            this.setState({
                show: !this.state.show,
            })
        }, 800);
    }

    componentWillUnmount() {
        if (this.cursorTimer) {
            clearInterval(this.cursorTimer);
            this.cursorTimer = null;
        }
    }

    render() {
        return <View style={[styles.cursor, {opacity: this.state.show ? 1 : 0}]}/>;
    }
}

const styles = StyleSheet.create({
    cursor: {
        width: 1.5,
        height: 30,
        backgroundColor: "#ff7f50"
    },
});