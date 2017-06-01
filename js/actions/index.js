/**
 * Created by wangyu on 2017/5/29.
 */

const HIGHLIGHT_LINE = "HIGHLIGHT_LINE";
const HIGHLIGHT_ICON = "HIGHLIGHT_ICON";
const TRANSLATE_VALUE = "TRANSLATE_VALUE";
const CHANGE_SHOW_LIST = "CHANGE_SHOW_LIST";
const CHANGE_SHOW_TYPE = "CHANGE_SHOW_TYPE";
const FETCH_QUOTE_LIST = "FETCH_QUOTE_LIST";
const HIDE_CURRENCY_GUIDE = "HIDE_CURRENCY_GUIDE";

export default {
    HIGHLIGHT_LINE,
    highlightLine: (index: Number) => {
        return {
            type: HIGHLIGHT_LINE,
            data: index,
        }
    },

    HIGHLIGHT_ICON,
    highlightIcon: (index: Number) => {
        return {
            type: HIGHLIGHT_ICON,
            data: index,
        }
    },
    clearHighlightIcon: () => {
        return {
            type: HIGHLIGHT_ICON,
            data: -1,
        }
    },

    TRANSLATE_VALUE,
    translateValue: (value: String, key: String, showType: String) => {
        return {
            type: TRANSLATE_VALUE,
            value: value,
            key,
            showType,
        }
    },

    CHANGE_SHOW_LIST,
    changeShowList: (highlightLine: Number, newKey: String) => {
        return {
            type: CHANGE_SHOW_LIST,
            highlightLine,
            newKey,
        }
    },

    CHANGE_SHOW_TYPE,
    changeShowType: (showType: String) => {
        return {
            type: CHANGE_SHOW_TYPE,
            data: showType,
        }
    },

    HIDE_CURRENCY_GUIDE,
    hideCurrencyGuide: () => {
        return {
            type: HIDE_CURRENCY_GUIDE,
        }
    },

};