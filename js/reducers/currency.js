/**
 * Created by wangyu on 2016/7/29.
 */


const currencyList = [
    {name: '人民币', icon: require('../asset/country-icon/CNY.png'), key: 'CNY', rate: 1.0, money:"0"},
    {name: '美元', icon: require('../asset/country-icon/USD.png'), key: 'USD', rate: 1.0, money:"0"},
    {name: '港元', icon: require('../asset/country-icon/HKD.png'), key: 'HKD', rate: 1.0, money:"0"},
    {name: '日元', icon: require('../asset/country-icon/JPY.png'), key: 'JPY', rate: 1.0, money:"0"},
    {name: '欧元', icon: require('../asset/country-icon/EUR.png'), key: 'EUR', rate: 1.0, money:"0"},
    {name: '英镑', icon: require('../asset/country-icon/GBP.png'), key: 'GBP', rate: 1.0, money:"0"},
    {name: '泰铢', icon: require('../asset/country-icon/THB.png'), key: 'THB', rate: 1.0, money:"0"},
    {name: '韩元', icon: require('../asset/country-icon/KRW.png'), key: 'KRW', rate: 1.0, money:"0"},
    {name: '加元', icon: require('../asset/country-icon/CAD.png'), key: 'CAD', rate: 1.0, money:"0"},
    {name: '印尼盾', icon: require('../asset/country-icon/IDR.png'), key: 'IDR', rate: 1.0, money:"0"},
    {name: '新加坡元', icon: require('../asset/country-icon/SGD.png'), key: 'SGD', rate: 1.0, money:"0"},
    {name: '澳元', icon: require('../asset/country-icon/AUD.png'), key: 'AUD', rate: 1.0, money:"0"},
];

const showList = [0, 1, 2, 3];
export const showListLength = showList.length;

const initialState = {
    highlightLine: 0,
    highlightMoney: 0,
    highlightIcon: -1,
    updateState: 'none',
    updateError: '',
    updateTime: 0,
    currencyList: currencyList,
    showList: showList,
    showTip: true,
};

function calculator(state = initialState, action) {

    let newList;
    let highlightCurrency;
    switch (action.type) {
        case 'HIGHLIGHT_SELECT_LINE':

            highlightCurrency = state.currencyList[state.showList[action.index]];
            newList = state.currencyList.map((currency, index) => {
                if (index == state.showList[action.index]) {
                    return Object.assign({}, currency, {money: currency.money == 0 ? '' : highlightCurrency.money});
                } else if (index == state.showList[state.highlightLine]){
                    return Object.assign({}, currency, {money: Number(currency.money).toFixed(2)});
                } else {
                    return currency;
                }

            })
            return Object.assign({}, state, {
                highlightLine: action.index,
                currencyList: newList,
            });
        case 'HIGHLIGHT_ICON':
            return Object.assign({}, state, {
                highlightIcon: action.index,
            });
        case 'CALCULATE_MONEY':
            highlightCurrency = state.currencyList[state.showList[state.highlightLine]];
            newList = state.currencyList.map((currency, index) => {
                if (index == state.showList[state.highlightLine]) {
                    return Object.assign({}, currency, {money: action.money});
                } else {
                    return Object.assign({}, currency, {money: (action.money*(currency.rate/highlightCurrency.rate)).toFixed(2)});
                }

            });
            return Object.assign({}, state, {
                currencyList: newList,
            });
        case 'CHANGE_SHOW_LIST':
            newList = state.showList.map((showIndex, index) => {
                if (index == action.selectLine) {
                    return action.newIndex;
                }
                return showIndex;
            });
            return Object.assign({}, state, {
                showList: newList,
            });
        case 'FETCH_QUOTE_LIST':
            return Object.assign({}, state, {updateState: 'loading'});
        case 'RECEIVE_QUOTE_LIST':
            newList = currencyList.map((currency, index) => {
                if (currency.key == "USD") {
                    return Object.assign({}, currency, {
                        rate: 1.0,
                        money: index < state.currencyList.length ? state.currencyList[index].money : "0",
                    });
                }
                for (let quote of action.quoteList) {
                    if (quote.resource.fields.name == 'USD/'+currency.key) {
                        return Object.assign({}, currency, {
                            rate: Number(quote.resource.fields.price),
                            money: index < state.currencyList.length ? state.currencyList[index].money : "0",
                        });
                    }
                }
                return Object.assign({}, currency);
            });
            return Object.assign({}, state, {
                updateState: 'loaded',
                updateTime: new Date().getTime(),
                currencyList: newList,
            });
        case 'FETCH_QUOTE_LIST_FAILED':
            return Object.assign({}, state, {
                updateState: 'loadFailed',
                updateError: action.error,
            });
        case 'SET_SHOW_TIP':
            return Object.assign({}, state, {
                showTip: action.showTip,
            });
        default:
            return state;
    }
}

export default calculator;