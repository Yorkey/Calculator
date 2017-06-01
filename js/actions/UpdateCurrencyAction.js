/**
 * Created by wangyu on 2017/5/30.
 */
import ajax from "../utils/ajax";
import Action from "./index";

const START_UPDATE_QUOTE = "START_UPDATE_QUOTE";
const UPDATE_QUOTE_SUCCEED = "UPDATE_QUOTE_SUCCEED";
const UPDATE_QUOTE_FAILED = "UPDATE_QUOTE_FAILED";

export default {
    START_UPDATE_QUOTE,
    UPDATE_QUOTE_SUCCEED,
    UPDATE_QUOTE_FAILED,
    updateQuote: (value, key, showType) => {
        return (dispatch) => {
            dispatch({
                type: START_UPDATE_QUOTE
            });
            return ajax({
                method: "GET",
                url: "http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json"
            }).then((data) => {
                if (data.list && Array.isArray(data.list.resources)) {
                    dispatch({
                        type: UPDATE_QUOTE_SUCCEED,
                        data: data.list.resources,
                    });
                    dispatch(Action.translateValue(value, key, showType));
                } else {
                    dispatch({
                        type: UPDATE_QUOTE_FAILED,
                        data: "获取失败[0001]",
                    });
                }
            }).catch((error) => {
                dispatch({
                    type: UPDATE_QUOTE_FAILED,
                    data: "获取失败[0002]",
                });
            });
        }
    },
};