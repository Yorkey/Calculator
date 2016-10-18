/**
 * Created by wangyu on 2016/7/28.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ListView,
    InteractionManager
} from 'react-native';
import HorizontalMarginLine from './common/HorizontalMarginLine';
import CurrencyListModal from './CurrencyListModal';
import {connect} from 'react-redux';
import Utils from './utils';
import {highlightSelectLine, calculateMoney, updateCurrencyList} from './actions/currency';
import codePush from 'react-native-code-push';

class CalculatorApp extends Component {

    // 构造
    constructor(props) {
        super(props);

    }


    onChangeText(index, text) {

        this.props.dispatch(calculateMoney(text));
    }

    onSelectLine(index) {
        this.props.dispatch(highlightSelectLine(index));
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(highlightSelectLine(0));
            this.props.dispatch(updateCurrencyList());
        });
    }


    getCurrencyViewList() {
        let currencyViewList = [];
        let calculateListLength = this.props.showList.length;
        for (let i = 0; i < calculateListLength; ++i) {
            let currency = this.props.currencyList[this.props.showList[i]];
            currencyViewList.push(
                <View ref={currency.key} key={currency.key+i} style={this.props.highlightLine === i ? styles.highlightItem : styles.calculateItem}>
                    <TouchableOpacity style={styles.currencyIconContainer} onPress={() => this.refs.CurrencyListModal.show(i)}>
                        <Image style={styles.currencyIcon} resizeMode="stretch" source={currency.icon}/>
                    </TouchableOpacity>
                    <Text style={styles.currencyName}>{currency.name}</Text>
                    <TextInput style={styles.currencyInput}
                               underlineColorAndroid="transparent"
                               keyboardType="numeric" //decimal-pad
                               value={currency.money}
                               onFocus={ () => this.onSelectLine(i)}
                               onChangeText={ (text) => this.onChangeText(i, text)}/>
                </View>
            );
            if (i != calculateListLength-1) {
                currencyViewList.push(<HorizontalMarginLine key={"CurrencyViewListSeparator"+i}/>);
            }
        }

        return currencyViewList;
    }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.calculateList} keyboardShouldPersistTaps={true}>
                    {this.getCurrencyViewList()}
                </ScrollView>

                {
                    this.props.updateState == 'loading'
                        ?
                        <View style={styles.statusBar}>
                            <Text style={styles.statusBarText}>正在更新汇率...</Text>
                        </View>
                        :
                        null
                }
                {
                    this.props.updateState != 'loading'
                        ?
                        <View style={styles.statusBar}>
                            <Text style={styles.statusBarText}>
                                {
                                    (this.props.updateState == 'loadFailed' ? this.props.updateError : "") +
                                    (this.props.updateTime ? " 上次更新时间 "+Utils.formatDate(new Date(this.props.updateTime), "yyyy-MM-dd hh:mm:ss") : "")
                                }
                            </Text>
                            <TouchableOpacity style={styles.statusBarBtn} onPress={() => this.props.dispatch(updateCurrencyList())}>
                                <Text style={styles.statusBarBtnText}>重新加载</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                }

                <CurrencyListModal {...this.props} ref="CurrencyListModal" />



            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    calculateList: {
        height: 140,
        marginTop: 20,
        marginLeft: 15,
        marginRight: 15,
        elevation: 2,
    },
    calculateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#ffffff',
        borderWidth: 0,
    },
    highlightItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 75,
        backgroundColor: '#ffffff',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#4ad9f8'
    },
    currencyIconContainer: {
        width: 50,
        height: 30,
        marginLeft: 14,
    },
    currencyIcon: {
        width: 50,
        height: 30,
    },
    currencyName: {
        width: 70,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 15,
        color: '#333333',
    },
    currencyInput: {
        flex: 1,
        height: 40,
        marginRight: 10,
        paddingTop: 0,
        paddingBottom: 0,
        textAlign: 'right',
        fontSize: 18,
        color: '#333333',
    },
    statusBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: "center",
        flexDirection: "row",
    },
    statusBarText: {
        flex: 1,
        textAlign: 'left',
        fontSize: 13,
        color:'#fff',
        marginLeft: 9,
    },
    statusBarBtn: {
        justifyContent: 'center',
        width: 90,
        height: 30,
        marginLeft: 9,
        marginRight: 9,
        borderWidth: StyleSheet.hairlineWidth*2,
        borderColor: 'rgba(74, 157, 248, 0.7)',
        borderRadius: 4,
        backgroundColor: 'rgba(74, 157, 248, 1.0)',
    },
    statusBarBtnText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#fff',
    }
});

function select(store) {
    return {
        ...store.currency
    };
}

export default codePush(connect(select)(CalculatorApp));
//module.exports = connect(CalculatorApp);