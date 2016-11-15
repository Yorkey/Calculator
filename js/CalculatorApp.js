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
    InteractionManager,
    ToastAndroid,
    BackAndroid
} from 'react-native';
import HorizontalMarginLine from './common/HorizontalMarginLine';
//import CurrencyListModal from './CurrencyListModal';
import CurrencyListPopup from './CurrencyListPopup';
import {connect} from 'react-redux';
import Utils from './utils';
import {highlightSelectLine, calculateMoney, updateCurrencyList} from './actions/currency';
import codePush from 'react-native-code-push';
import KeyBoard from './KeyBoard';
import {showListLength} from './reducers/currency';

class CalculatorApp extends Component {

    // 构造
    constructor(props) {
        super(props);

    }


    onChangeText(text) {

        this.props.dispatch(calculateMoney(text));
    }

    onSelectLine(index) {
        this.props.dispatch(highlightSelectLine(index));
    }

    onKeyClick(payload) {
        let currency = this.props.currencyList[this.props.showList[this.props.highlightLine]];
        let newMoney, oldMoney;
        switch (payload.type) {
            case 'number':
                newMoney = String(currency.money) + payload.text;
                this.onChangeText(newMoney);
                break;
            case 'dot':
                newMoney = String(currency.money) + ".";
                this.onChangeText(newMoney);
                break;
            case 'clear':
                newMoney = "";
                this.onChangeText(newMoney);
                break;
            case 'delete':
                oldMoney = String(currency.money);
                newMoney = oldMoney.length > 0 ? oldMoney.substr(0, oldMoney.length-1) : "";
                this.onChangeText(newMoney);
                break;
            case 'tab':
                let nextLine = this.props.highlightLine >= showListLength-1 ? 0 : this.props.highlightLine+1;
                this.onSelectLine(nextLine);
                break;
            default:
                console.warn(`Unknow key type ${payload.type}`);
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(highlightSelectLine(0));
            this.props.dispatch(updateCurrencyList());
        });

        BackAndroid.addEventListener('hardwareBackPress', () => {

            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                //最近2秒内按过back键，可以退出应用。
                return false;
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true;
        });
    }



    getCurrencyViewList() {
        let currencyViewList = [];
        let calculateListLength = this.props.showList.length;
        for (let i = 0; i < calculateListLength; ++i) {
            let currency = this.props.currencyList[this.props.showList[i]];
            currencyViewList.push(
                <TouchableOpacity ref={currency.key}
                                  key={currency.key+i}
                                  style={this.props.highlightLine === i ? styles.highlightItem : styles.calculateItem}
                                  activeOpacity={0.8}
                                  onPress={() => this.onSelectLine(i)}>
                    <TouchableOpacity style={styles.currencyIconContainer} onPress={() => this.refs.CurrencyListPopup.open(i)}>
                        <Image style={styles.currencyIcon} resizeMode="stretch" source={currency.icon}/>
                    </TouchableOpacity>
                    <Text style={styles.currencyName}>{currency.name}</Text>

                    <Text style={styles.currencyInput}>{currency.money}</Text>

                </TouchableOpacity>
            );
            if (i != calculateListLength-1) {
                currencyViewList.push(<HorizontalMarginLine key={"CurrencyViewListSeparator"+i}/>);
            }
        }

        return currencyViewList;
    }


    render() {

        let stateBar;
        if (this.props.updateState == 'loading') {
            stateBar = (
                <View style={styles.statusBar}>
                    <Text style={styles.statusBarText}>正在更新汇率...</Text>
                </View>
            )
        } else {
            stateBar = (
                <View style={styles.statusBar}>
                    <Text style={styles.statusBarText}>
                        {
                            (this.props.updateState == 'loadFailed' ? this.props.updateError+"\n" : "") +
                            (this.props.updateTime ? "上次更新时间 "+Utils.formatDate(new Date(this.props.updateTime), "yyyy-MM-dd hh:mm:ss") : "")
                        }
                    </Text>
                    <TouchableOpacity style={styles.statusBarBtn} onPress={() => this.props.dispatch(updateCurrencyList())}>
                        <Text style={styles.statusBarBtnText}>重新加载</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <ScrollView style={styles.calculateList} keyboardShouldPersistTaps={true}>
                    {this.getCurrencyViewList()}
                </ScrollView>


                {stateBar}

                <KeyBoard style={styles.keyboard} onPress={(payload) => this.onKeyClick(payload)} />

                {
                    // <CurrencyListModal {...this.props} ref="CurrencyListModal" />
                     <CurrencyListPopup {...this.props} ref="CurrencyListPopup" />
                }

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
        //elevation: 2,
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
        borderWidth: StyleSheet.hairlineWidth*2,
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
        marginRight: 10,
        textAlign: 'right',
        fontSize: 18,
        color: '#333333',
    },
    statusBar: {
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
    },
    keyboard: {
        height: 200,
        backgroundColor: '#fff',
    }
});

function select(store) {
    return {
        ...store.currency
    };
}

export default codePush(connect(select)(CalculatorApp));
//module.exports = connect(CalculatorApp);