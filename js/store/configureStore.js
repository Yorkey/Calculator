/**
 * Created by wangyu on 2016/7/29.
 */
import { AsyncStorage } from 'react-native';
import {applyMiddleware, createStore, compose} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist';
import indexReducer from '../reducers/index';
var createLogger = require('redux-logger');

const whitelist = ["listInfo", "translateListInfo", "showCurrencyGuide"];

let logger = createLogger({
    predicate: (getState, action) => false,
    collapsed: true,
    duration: true,
});


export default function configureStore(onComplete) {
    const enhancer = compose(
        applyMiddleware(
            thunk,  // 允许我们 dispatch() 函数
            logger,
        ),
        autoRehydrate(),
    );
    const store = createStore(indexReducer, {}, enhancer);
    persistStore(store, {whitelist: whitelist, storage: AsyncStorage}, onComplete);
    return store;
}