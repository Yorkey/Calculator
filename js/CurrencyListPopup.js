/**
 * Created by wangyu on 2016/8/2.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    InteractionManager
} from 'react-native';

import HorizontalMarginLine from './common/HorizontalMarginLine';
import HorizontalLine from './common/HorizontalLine';
import Button from 'react-native-button';
import Action from './actions/index';
import { translateTypeList } from "./reducers/index";
let Modal = require("react-native-modalbox");

function CurrencyItem({item, index, onPress}) {

    return (
        <TouchableOpacity style={styles.listItem} activeOpacity={0.8} onPress={() => onPress && onPress(index, item)}>
            <Image style={styles.currencyIcon} resizeMode="stretch" source={item.icon} />
            <Text style={styles.currencyName}>{item.name}</Text>
            <Text style={styles.currencyRate}>{item.rate.toFixed(7)}</Text>
        </TouchableOpacity>
    );
}

export default class CurrencyListModal extends Component {

    // 构造
    constructor(props) {
        super(props);

        this.selectLine = 0;
    }

    onListItemClick = (index, item) => {
        this.refs.popup.close();
        InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(Action.changeShowList(this.selectLine, item.key));
        });
    };

    open = (selectLine) => {
        this.selectLine = selectLine;
        this.refs.popup.open();
    };

    close = () => {
        this.refs.popup.close();
    };

    renderItem = ({item, index}) => {
        let { showType, translateMap } = this.props;
        let translateItem = translateMap[showType][item];
        return <CurrencyItem item={translateItem} index={index} onPress={this.onListItemClick} />;
    };

    render() {
        let { showType } = this.props;
        let height = translateTypeList[showType].length < 5 ? translateTypeList[showType].length*50+2+28+44 : 280;
        return (
            <Modal ref="popup" style={[styles.container, {height: height}]}
                   position="bottom"
                   backButtonClose={true}
                   onOpened={this.props.onOpened}
                   onClosed={this.props.onClosed}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{showType==="currency" ? "选择币种" : "选择单位"}</Text>
                        <Text style={styles.titleRight}>{showType==="currency" ? "当前汇率" : "比例"}</Text>
                    </View>
                    <HorizontalLine />
                </View>
                <FlatList data={translateTypeList[showType]}
                          keyExtractor={(item, index) => item}
                          renderItem={this.renderItem}
                          ItemSeparatorComponent={HorizontalMarginLine}
                          ListFooterComponent={HorizontalLine}/>
                <HorizontalLine />
                <Button containerStyle={styles.cancelButtonContainer} style={styles.cancelButtonText} onPress={this.close}>
                    取消
                </Button>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#fff',
        width:Dimensions.get('window').width,
    },
    currencyList: {
        flex: 1,
        //height: 200,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#ffffff',
    },
    currencyIcon: {
        width: 50,
        height: 30,
        marginLeft: 10,
    },
    currencyName: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 15,
        color: '#333333',
    },
    currencyRate: {
        marginRight: 12,
        fontSize: 15,
        color: '#333333',
    },
    header: {
        justifyContent: 'flex-end',
        height: 28,
        backgroundColor: '#ffffff',
    },
    titleContainer: {
        flexDirection: 'row',
    },
    title: {
        flex: 1,
        marginLeft: 10,
        marginBottom: 2,
        fontSize: 15,
        color: '#666666',
    },
    titleRight: {
        marginRight: 10,
        marginBottom: 2,
        fontSize: 15,
        color: '#999999',
    },
    cancelButtonContainer: {
        height:44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        color:'#666',
        fontWeight :'normal',
        fontSize:16
    },
});