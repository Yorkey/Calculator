/**
 * Created by wangyu on 2016/7/29.
 */
import { AsyncStorage } from 'react-native';
import {applyMiddleware, createStore, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist';
var createLogger = require('redux-logger');
var currencyReducers = require('../reducers/currency.js');


let logger = createLogger({
    predicate: (getState, action) => false,
    collapsed: true,
    duration: true,
});

let reducers = combineReducers({currency: currencyReducers});

let createCalculatorAppStore = applyMiddleware(thunk, logger)(createStore);

function configureStore(onComplete) {
    let store = autoRehydrate()(createCalculatorAppStore)(reducers);
    persistStore(store, {storage: AsyncStorage}, onComplete);
    return store;
}

module.exports = {configureStore};