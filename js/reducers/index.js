/**
 * Created by wangyu on 2017/5/29.
 */
import { combineReducers } from "redux";
import actions from "../actions/index";
import UpdateCurrencyAction from "../actions/UpdateCurrencyAction";

export const translateTypeList = {
    currency: [
        "CNY",
        "USD",
        "HKD",
        "JPY",
        "EUR",
        "GBP",
        "THB",
        "KRW",
        "CAD",
        "IDR",
        "SGD",
        "AUD",
    ],
};

let defaultTranslateMap = {
    currency: {
        CNY: {name: '人民币', icon: require('../asset/country-icon/CNY.png'), key: 'CNY', rate: 1.0, value: ""},
        USD: {name: '美元', icon: require('../asset/country-icon/USD.png'), key: 'USD', rate: 1.0, value: ""},
        HKD: {name: '港元', icon: require('../asset/country-icon/HKD.png'), key: 'HKD', rate: 1.0, value: ""},
        JPY: {name: '日元', icon: require('../asset/country-icon/JPY.png'), key: 'JPY', rate: 1.0, value: ""},
        EUR: {name: '欧元', icon: require('../asset/country-icon/EUR.png'), key: 'EUR', rate: 1.0, value: ""},
        GBP: {name: '英镑', icon: require('../asset/country-icon/GBP.png'), key: 'GBP', rate: 1.0, value: ""},
        THB: {name: '泰铢', icon: require('../asset/country-icon/THB.png'), key: 'THB', rate: 1.0, value: ""},
        KRW: {name: '韩元', icon: require('../asset/country-icon/KRW.png'), key: 'KRW', rate: 1.0, value: ""},
        CAD: {name: '加元', icon: require('../asset/country-icon/CAD.png'), key: 'CAD', rate: 1.0, value: ""},
        IDR: {name: '印尼盾', icon: require('../asset/country-icon/IDR.png'), key: 'IDR', rate: 1.0, value: ""},
        SGD: {name: '新加坡元', icon: require('../asset/country-icon/SGD.png'), key: 'SGD', rate: 1.0, value: ""},
        AUD: {name: '澳元', icon: require('../asset/country-icon/AUD.png'), key: 'AUD', rate: 1.0, value: ""},
    },
};

let highlightLine = (state = 0, action) => {
    switch (action.type){
        case actions.HIGHLIGHT_LINE:
            return action.data;
        default:
            return state;
    }
};

let highlightIcon = (state = -1, action) => {
    switch (action.type){
        case actions.HIGHLIGHT_ICON:
            return action.data;
        default:
            return state;
    }
};

let showCurrencyGuide = (state = true, action) => {
    switch (action.type){
        case actions.HIDE_CURRENCY_GUIDE:
            return false;
        default:
            return state;
    }
};

const defaultListInfo = {
    showType: "currency",
    showList: {
        currency: ["CNY", "USD", "HKD", "JPY"],
    },
};
let listInfo = (state = defaultListInfo, action) => {
    switch (action.type){
        case actions.CHANGE_SHOW_LIST:
            let newList = [...state.showList[state.showType]];
            newList[action.highlightLine] = action.newKey;
            state.showList[state.showType] = newList;
            return {...state};
        case actions.CHANGE_SHOW_TYPE:
            return {...state, showType: action.data};
        default:
            return state;
    }
};


const defaultTranslateMapInfo = {
    loadingQuote: false,
    loadQuoteError: null,
    updateTime: null,
    translateMap: defaultTranslateMap,
};
let translateListInfo = (state = defaultTranslateMapInfo, action) => {
    let newTranslateMap;
    switch (action.type){
        case actions.TRANSLATE_VALUE:
            let newTranslate = {...state.translateMap[action.showType]};
            for (let key in newTranslate) {
                if (key === action.key) {
                    newTranslate[key].value = action.value;
                } else {
                    if (action.value === "") {
                        newTranslate[key].value = "";
                    } else if (Number(action.value) === 0) {
                        newTranslate[key].value = "0";
                    } else {
                        let newValue = Number(action.value)*newTranslate[key].rate/newTranslate[action.key].rate;
                        newTranslate[key].value = newValue.toFixed(3);
                    }
                }
            }
            newTranslateMap = {...state.translateMap};
            newTranslateMap[action.showType] = newTranslate;
            return {...state, translateMap: newTranslateMap};
        case UpdateCurrencyAction.START_UPDATE_QUOTE:
            return {...state, loadingQuote: true};
        case UpdateCurrencyAction.UPDATE_QUOTE_SUCCEED:
            let currencyMap = {...state.translateMap.currency};
            for (let key in currencyMap) {
                for (let quote of action.data) {
                    if (quote.resource.fields.name === "USD/"+key) {
                        currencyMap[key].rate = Number(quote.resource.fields.price);
                        break;
                    }
                }
            }
            newTranslateMap = {...state.translateMap, currency: currencyMap};
            return {...state, loadingQuote: false, loadQuoteError: null, updateTime: new Date().getTime(), translateMap: newTranslateMap};
        case UpdateCurrencyAction.UPDATE_QUOTE_FAILED:
            return {...state, loadingQuote: false, loadQuoteError: action.data};
        default:
            return state;
    }
};

export default combineReducers({
    highlightLine,
    highlightIcon,
    showCurrencyGuide,
    listInfo,
    translateListInfo,
});
