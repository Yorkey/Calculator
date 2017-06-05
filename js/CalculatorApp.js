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
    InteractionManager,
    ToastAndroid,
    BackHandler,
} from 'react-native';
import HorizontalMarginLine from './common/HorizontalMarginLine';
import CurrencyListPopup from './CurrencyListPopup';
import {connect} from 'react-redux';
import Utils from './utils';
import Action from './actions/index';
import UpdateCurrencyAction from './actions/UpdateCurrencyAction';
import codePush from 'react-native-code-push';
import KeyBoard from './KeyBoard';
import CursorView from "./CursorView";

class CalculatorApp extends Component {

    // 构造
    constructor(props) {
        super(props);

        this.currencyListPopupRef = null;

        this.onPopupClosed = this.onPopupClosed.bind(this);
        this.onIconClick = this.onIconClick.bind(this);
        this.onTipClicked = this.onTipClicked.bind(this);
        this.onSwitchClick = this.onSwitchClick.bind(this);
    }


    onChangeText(value, key, showType) {
        this.props.dispatch(Action.translateValue(value, key, showType));
    }

    onSelectLine(index) {
        this.props.dispatch(Action.highlightLine(index));
    }

    onIconClick(index) {
        this.props.dispatch(Action.highlightIcon(index));
        this.currencyListPopupRef.open(index);
    }

    onSwitchClick(showType) {
        this.props.dispatch(Action.changeShowType(showType));
    }

    onPopupClosed() {
        this.props.dispatch(Action.clearHighlightIcon());
    }

    onUpdateQuote() {
        let {showType, showList, translateMap, highlightLine} = this.props;
        let highlightItem = showList[showType][highlightLine];
        let translateItem = translateMap[showType][highlightItem];
        this.props.dispatch(UpdateCurrencyAction.updateQuote(translateItem.value, highlightItem, showType));
    }

    onTipClicked() {
        this.props.dispatch(Action.hideCurrencyGuide());
    }

    onKeyClick(payload) {
        let {showType, showList, translateMap, highlightLine} = this.props;
        let highlightItem = showList[showType][highlightLine];
        let translateItem = translateMap[showType][highlightItem];
        let newMoney, oldMoney;
        switch (payload.type) {
            case 'number':
                newMoney = translateItem.value + payload.text;
                this.onChangeText(newMoney, highlightItem, showType);
                break;
            case 'dot':
                newMoney = translateItem.value + ".";
                this.onChangeText(newMoney, highlightItem, showType);
                break;
            case 'clear':
                newMoney = "";
                this.onChangeText(newMoney, highlightItem, showType);
                break;
            case 'delete':
                oldMoney = translateItem.value;
                newMoney = oldMoney.length > 0 ? oldMoney.substr(0, oldMoney.length-1) : "";
                this.onChangeText(newMoney, highlightItem, showType);
                break;
            case 'tab':
                let nextLine = highlightLine >= showList[showType].length-1 ? 0 : highlightLine+1;
                this.onSelectLine(nextLine);
                break;
            case 'more':
                this.props.modal.popup({
                    hideTitle: true,
                    buttons: [
                        {name: "汇率", value: "currency"},
                        {name: "长度", value: "len"}
                    ],
                    onSubmit: (type) => {
                        this.onSwitchClick(type);
                        return true;
                    },
                });
                break;
            default:
                console.warn(`Unknown key type ${payload.type}`);
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(Action.highlightLine(1));
            if (this.props.showType === "currency") {
                this.onUpdateQuote();
            }
        });

        BackHandler.addEventListener('hardwareBackPress', () => {

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
        let {showType, showList, translateMap, highlightLine, highlightIcon} = this.props;
        let currencyViewList = [];
        let calculateListLength = showList[showType].length;
        for (let i = 0; i < calculateListLength; ++i) {
            let showItem = showList[showType][i];
            let translateItem = translateMap[showType][showItem];
            currencyViewList.push(
                <TouchableOpacity ref={translateItem.key}
                                  key={translateItem.key+i}
                                  style={[styles.calculateItem, highlightLine === i ? styles.highlightItem : null]}
                                  activeOpacity={0.8}
                                  onPress={() => this.onSelectLine(i)}>
                    <TouchableOpacity style={highlightIcon === i ? styles.highlightIcon : null}
                                      activeOpacity={0.8}
                                      onPress={() => this.onIconClick(i)}>
                        {
                            translateItem.icon ?
                                <Image style={styles.currencyIcon} resizeMode="stretch" source={translateItem.icon}/>
                                :
                                <Text style={styles.currencyTextIcon}>{translateItem.textIcon}</Text>
                        }
                    </TouchableOpacity>
                    <Text style={[styles.currencyName, highlightLine === i ? styles.highlightColor : null]}>{translateItem.name}</Text>

                    <Text style={[styles.currencyInput, highlightLine === i ? styles.highlightColor : null]}>
                        {
                            translateItem.value === "" ?
                                <Text style={styles.currencyInputHint}>{translateItem.rate.toFixed(3)}</Text>
                                :
                                null
                        }
                        {translateItem.value}
                    </Text>

                    {
                        (highlightLine === i) && <CursorView />
                    }


                </TouchableOpacity>
            );
            if (i !== calculateListLength-1) {
                currencyViewList.push(<HorizontalMarginLine key={"CurrencyViewListSeparator"+i}/>);
            }
        }

        return currencyViewList;
    }

    _getCurrencyStateBar() {
        let {showType, loadingQuote, loadQuoteError, updateTime,} = this.props;
        if (showType === "currency") {
            if (loadingQuote) {
                return (
                    <View style={styles.statusBar}>
                        <Text style={styles.statusBarText}>正在更新汇率...</Text>
                    </View>
                )
            } else {
                return (
                    <View style={styles.statusBar}>
                        <Text style={styles.statusBarText}>
                            {
                                (loadQuoteError ? loadQuoteError+"\n" : "") +
                                (updateTime ? "上次更新时间 "+Utils.formatDate(new Date(updateTime), "yyyy-MM-dd hh:mm:ss") : "")
                            }
                        </Text>
                        <TouchableOpacity style={styles.statusBarBtn} onPress={() => this.onUpdateQuote()}>
                            <Text style={styles.statusBarBtnText}>重新加载</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        } else {
            return null;
        }
    }

    render() {

        let {showCurrencyGuide} = this.props;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.calculateList} keyboardShouldPersistTaps="handled">
                    {this.getCurrencyViewList()}
                </ScrollView>


                { this._getCurrencyStateBar() }

                <KeyBoard style={styles.keyboard} onPress={(payload) => this.onKeyClick(payload)} />

                {
                     <CurrencyListPopup {...this.props} ref={(ref) => this.currencyListPopupRef = ref} onClosed={this.onPopupClosed} />
                }

                {
                    showCurrencyGuide &&
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

function select(store) {
    return {
        highlightLine: store.highlightLine,
        highlightIcon: store.highlightIcon,
        showCurrencyGuide: store.showCurrencyGuide,
        ...store.listInfo,
        ...store.translateListInfo,
    };
}

export default codePush((connect(select)(CalculatorApp)));
//export default codePush({ updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE })(connect(select)(CalculatorApp));
//module.exports = connect(CalculatorApp);

const styles = StyleSheet.create({
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
        paddingLeft: 10,
        paddingRight: 10,
    },
    highlightItem: {
        height: 70,
    },
    highlightColor: {
        color: '#ff7f50',
    },
    currencyIcon: {
        width: 50,
        height: 33,
    },
    currencyTextIcon: {
        width: 50,
        paddingLeft: 10,
        fontSize: 20,
        color: "#333",
        fontWeight: "bold",
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
        textAlign: 'right',
        fontSize: 18,
        color: '#333333',
    },
    currencyInputHint: {
        color: '#ccc',
    },
    cursor: {
        width: 1.5,
        height: 50,
        backgroundColor: "#ff7f50"
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