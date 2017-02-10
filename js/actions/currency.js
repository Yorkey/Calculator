/**
 * Created by wangyu on 2016/7/26.
 */

import ajax from "../utils/ajax";

function highlightSelectLine(index: Number) {
    return {
        type: 'HIGHLIGHT_SELECT_LINE',
        index,
    }
}

function highlightIcon(index: Number) {
    return {
        type: 'HIGHLIGHT_ICON',
        index,
    }
}

function calculateMoney(money: String) {
    return {
        type: 'CALCULATE_MONEY',
        money,
    }
}


function changeShowList(selectLine: Number, newIndex: Number) {
    return {
        type: 'CHANGE_SHOW_LIST',
        selectLine,
        newIndex,
    }
}

function fetchQuoteList() {
    return {
        type: 'FETCH_QUOTE_LIST',
    }
}

function receiveQuoteList(quoteList) {
    return {
        type: 'RECEIVE_QUOTE_LIST',
        quoteList,
    }
}

function fetchQuoteListFailed(error: String) {
    return {
        type: 'FETCH_QUOTE_LIST_FAILED',
        error,
    }
}


function updateCurrencyList() {
    return (dispatch) => {
        dispatch(fetchQuoteList());
        ajax({
            method: "GET",
            url: "http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json"
        }).then((data) => {
            if (data.list && Array.isArray(data.list.resources)) {
                dispatch(receiveQuoteList(data.list.resources));
            } else {
                dispatch(fetchQuoteListFailed("获取失败,列表为空"));
            }
        }).catch((error) => {
            dispatch(fetchQuoteListFailed(error.description || "获取失败"));
        });
    }
}

export {highlightSelectLine, highlightIcon, calculateMoney, changeShowList, updateCurrencyList};