/**
 * Created by wangyu on 2016/11/14.
 */
import React, {Component} from 'react';
import {
    View,
    Dimensions
} from 'react-native';
import StyleSheet from 'StyleSheet';
import KeyButton from './KeyButton';
import keyMap from './KeyMap';
const KEYBOARD_WIDTH  = Dimensions.get("window").width;
const KEYBOARD_HEIGHT = 200;
const KEY_OFFSET = 5;
const KEY_NUM_WIDTH = KEYBOARD_WIDTH/4 - KEY_OFFSET;
const KEY_FN_WIDTH = KEYBOARD_WIDTH/4 + KEY_OFFSET*3;



export default class KeyBoard extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};

    }

    render() {

        let numKeyContent = (
            <View style={styles.numberKeyContainer}>
                <View style={styles.numKeyLine}>
                    <KeyButton style={styles.numKey} payload={keyMap[7]} onPress={this.props.onPress}/>
                    <View style={styles.separatorV} />
                    <KeyButton style={styles.numKey} payload={keyMap[8]} onPress={this.props.onPress}/>
                    <View style={styles.separatorV} />
                    <KeyButton style={styles.numKey} payload={keyMap[9]} onPress={this.props.onPress}/>
                </View>
                <View style={styles.separatorH} />
                <View style={styles.numKeyLine}>
                    <KeyButton style={styles.numKey} payload={keyMap[4]} onPress={this.props.onPress}/>
                    <View style={styles.separatorV} />
                    <KeyButton style={styles.numKey} payload={keyMap[5]} onPress={this.props.onPress}/>
                    <View style={styles.separatorV} />
                    <KeyButton style={styles.numKey} payload={keyMap[6]} onPress={this.props.onPress}/>
                </View>
                <View style={styles.separatorH} />
                <View style={styles.numKeyLine}>
                    <KeyButton style={styles.numKey} payload={keyMap[1]} onPress={this.props.onPress}/>
                    <View style={styles.separatorV} />
                    <KeyButton style={styles.numKey} payload={keyMap[2]} onPress={this.props.onPress}/>
                    <View style={styles.separatorV} />
                    <KeyButton style={styles.numKey} payload={keyMap[3]} onPress={this.props.onPress}/>
                </View>
                <View style={styles.separatorH} />
                <View style={styles.numKeyLine}>
                    <KeyButton style={styles.numKey} payload={keyMap["more"]} onPress={this.props.onPress}/>
                    <View style={styles.separatorV} />
                    <KeyButton style={styles.numKey} payload={keyMap[0]} onPress={this.props.onPress}/>
                    <View style={styles.separatorV} />
                    <KeyButton style={styles.numKey} payload={keyMap["dot"]} onPress={this.props.onPress}/>
                </View>
            </View>
        );

        let fnKeyContent = (
            <View>
                <KeyButton style={styles.fnKey} payload={keyMap["clear"]} onPress={this.props.onPress}/>
                <View style={styles.separatorH} />
                <KeyButton style={styles.fnKey} payload={keyMap["delete"]} onPress={this.props.onPress}/>
                <View style={styles.separatorH} />
                <KeyButton style={styles.fnKey} payload={keyMap["tab"]} onPress={this.props.onPress}/>
            </View>
        );

        return (
            <View style={[styles.container, this.props.style]}>
                {numKeyContent}
                <View style={styles.separatorV} />
                {fnKeyContent}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    numberKeyContainer: {
        flex: 1,
    },
    numKeyLine: {
        flexDirection: 'row',
        flex: 1,
    },
    numKey: {
        width: KEY_NUM_WIDTH,
    },
    numKeyFixed: {
        width: KEY_NUM_WIDTH*2,
        justifyContent: 'flex-start',
        paddingLeft: KEY_NUM_WIDTH/2-4,
    },
    zeroLabel: {
        //alignSelf: 'flex-start',
        //marginLeft: KEY_NUM_WIDTH-4,
    },
    fnKey: {
        width: KEY_FN_WIDTH,
    },
    separatorH: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#dfdfdf",
    },
    separatorV: {
        width: StyleSheet.hairlineWidth,
        backgroundColor: "#dfdfdf",
    }
});