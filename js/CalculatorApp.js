/**
 * Created by wangyu on 2016/7/28.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    InteractionManager,
    ToastAndroid,
    BackAndroid,
    AsyncStorage
} from 'react-native';
import HorizontalMarginLine from './common/HorizontalMarginLine';
//import CurrencyListModal from './CurrencyListModal';
import CurrencyListPopup from './CurrencyListPopup';
import {connect} from 'react-redux';
import Utils from './utils';
import {highlightSelectLine, highlightIcon, calculateMoney, updateCurrencyList, closeShopTip} from './actions/currency';
import codePush from 'react-native-code-push';
import KeyBoard from './KeyBoard';
import {showListLength} from './reducers/currency';

class CalculatorApp extends Component {

    // 构造
    constructor(props) {
        super(props);

        this.state = {
            showTip: this.props.showTip,
        };

        this.currencyListPopupRef = null;

        this.onPopupClosed = this.onPopupClosed.bind(this);
        this.onIconClick = this.onIconClick.bind(this);
        this.onTipClicked = this.onTipClicked.bind(this);
    }


    onChangeText(text) {

        this.props.dispatch(calculateMoney(text));
    }

    onSelectLine(index) {
        this.props.dispatch(highlightSelectLine(index));
    }

    onIconClick(index) {
        this.currencyListPopupRef.open(index);
        this.props.dispatch(highlightIcon(index));
    }

    onPopupClosed() {
        this.props.dispatch(highlightIcon(-1));
    }

    onTipClicked() {
        this.setState({
            showTip: false,
        });
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
                console.warn(`Unknown key type ${payload.type}`);
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

        if (this.props.showTip) {
            this.props.dispatch(closeShopTip());
        }
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
                    <TouchableOpacity onPress={() => this.onIconClick(i)}>
                        <Image style={[styles.currencyIcon, this.props.highlightIcon === i ? styles.highlightIcon : null]} resizeMode="stretch" source={currency.icon}/>
                    </TouchableOpacity>
                    <Text style={[styles.currencyName, this.props.highlightLine === i ? styles.highlightColor : null]}>{currency.name}</Text>

                    <Text style={[styles.currencyInput, this.props.highlightLine === i ? styles.highlightColor : null]}>{currency.money}</Text>

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
                     <CurrencyListPopup {...this.props} ref={(ref) => this.currencyListPopupRef = ref} onClosed={this.onPopupClosed} />
                }

                {
                    this.state.showTip &&
                    <TouchableOpacity style={styles.tipBackground} activeOpacity={1.0} onPress={this.onTipClicked}>
                        <View style={styles.tipContainer}>
                            <Image style={styles.tipArrow} source={require("./asset/tip-arrow.png")}/>
                            <Text style={styles.tipText}>点击图标可切换币种</Text>
                        </View>
                    </TouchableOpacity>
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
    },
    highlightItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 70,
        backgroundColor: '#ffffff',
    },
    highlightColor: {
        color: '#ff7f50',
    },
    currencyIcon: {
        width: 50,
        height: 33,
        marginLeft: 14,
    },
    highlightIcon: {
        padding: 1,
        borderWidth: 1,
        borderColor: "#ff7f50",
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
    },
    tipBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.8)'
    },
    tipContainer: {
        flexDirection: "row",
        position: 'absolute',
        top: 133,
        left: 30,
    },
    tipArrow: {
        width: 104,
        height: 70,
    },
    tipText: {
        fontSize: 18,
        color: "rgba(255,255,255,0.8)",
    }
});

function select(store) {
    return {
        ...store.currency
    };
}

export default codePush((connect(select)(CalculatorApp)));
//export default codePush({ updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE })(connect(select)(CalculatorApp));
//module.exports = connect(CalculatorApp);