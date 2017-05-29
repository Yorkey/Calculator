/**
 * Created by wangyu on 2017/5/29.
 */
import actions from "../actions/index";

let translateList = {
    currency: {
        CNY: {name: '人民币', icon: require('../asset/country-icon/CNY.png'), key: 'CNY', rate: 1.0, value: 0},
        USD: {name: '美元', icon: require('../asset/country-icon/USD.png'), key: 'USD', rate: 1.0, value: 0},
        HKD: {name: '港元', icon: require('../asset/country-icon/HKD.png'), key: 'HKD', rate: 1.0, value: 0},
        JPY: {name: '日元', icon: require('../asset/country-icon/JPY.png'), key: 'JPY', rate: 1.0, value: 0},
        EUR: {name: '欧元', icon: require('../asset/country-icon/EUR.png'), key: 'EUR', rate: 1.0, value: 0},
        GBP: {name: '英镑', icon: require('../asset/country-icon/GBP.png'), key: 'GBP', rate: 1.0, value: 0},
        THB: {name: '泰铢', icon: require('../asset/country-icon/THB.png'), key: 'THB', rate: 1.0, value: 0},
        KRW: {name: '韩元', icon: require('../asset/country-icon/KRW.png'), key: 'KRW', rate: 1.0, value: 0},
        CAD: {name: '加元', icon: require('../asset/country-icon/CAD.png'), key: 'CAD', rate: 1.0, value: 0},
        IDR: {name: '印尼盾', icon: require('../asset/country-icon/IDR.png'), key: 'IDR', rate: 1.0, value: 0},
        SGD: {name: '新加坡元', icon: require('../asset/country-icon/SGD.png'), key: 'SGD', rate: 1.0, value: 0},
        AUD: {name: '澳元', icon: require('../asset/country-icon/AUD.png'), key: 'AUD', rate: 1.0, value: 0},
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