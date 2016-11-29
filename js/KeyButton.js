/**
 * Created by wangyu on 2016/11/14.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Platform
} from 'react-native'
import StyleSheet from 'StyleSheet';
import MyTouchable from './common/MyTouchable';

export default class KeyButton extends Component {

    render() {

        let {onPress, payload} = this.props;
        let content;
        if (payload && payload.icon) {
            content = (
                <View style={[styles.button, this.props.style]}>
                    <Image style={styles.icon} source={payload.icon} />
                </View>
            );
        } else if (payload && payload.text) {
            content = (
                <View style={[styles.button, this.props.style]}>
                    <Text style={[styles.buttonText, this.props.labelStyle]}>{payload.text}</Text>
                </View>
            );
        }

        return (
            <MyTouchable accessibilityTraits="button"
                         onPress={() => onPress && onPress(payload)} >
                {content}
            </MyTouchable>
        );
    }
}

const HEIGHT = 50;

const styles = StyleSheet.create({
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    buttonText: {
        fontSize: 22,
        color: '#333333',
    },
    icon: {
        width: 25,
        height: 25,
    }
});