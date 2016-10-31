/**
 * Created by wangyu on 2016/8/2.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView,
    InteractionManager
} from 'react-native';

import HorizontalMarginLine from './common/HorizontalMarginLine';
import HorizontalLine from './common/HorizontalLine';
import Button from 'react-native-button';
import {changeShowList} from './actions/currency';
var Modal = require("react-native-modalbox");

export default class CurrencyListModal extends Component {


    // 构造
    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });

        // 初始状态
        this.state = {
            currencySource: this.ds.cloneWithRows(this.props.currencyList),
        };

        this.selectLine = 0;

        this.renderRow = this.renderRow.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
        this.close = this.close.bind(this);
    }




    onListItemClick(index) {
        this.refs.popup.close();
        InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(changeShowList(this.selectLine, index));
        });
    }

    open(selectLine) {
        this.selectLine = selectLine;
        this.refs.popup.open();
    }

    close() {
        this.refs.popup.close();
    }


    renderSeparator(sectionID:number, rowID:number) {

        if (rowID == this.props.currencyList.length-1) {
            return <HorizontalLine key={`${sectionID}-${rowID}`} />;
        } else {
            return <HorizontalMarginLine key={`${sectionID}-${rowID}`}/>;
        }
    }

    renderHeader() {
        return (
            <View style={styles.header}>
                <Text style={styles.title}>选择币种 </Text>
                <HorizontalLine />
            </View>
        );
    }

    renderRow(rowData, sectionID, rowID, highlightRow) {
        return (
          <TouchableOpacity style={styles.listItem} activeOpacity={0.8} onPress={() => this.onListItemClick(rowID)}>
              <Image style={styles.currencyIcon} resizeMode="stretch" source={rowData.icon} />
              <Text style={styles.currencyName}>{rowData.name}</Text>
              <Text style={styles.currencyRate}>{rowData.rate.toFixed(3)}</Text>
          </TouchableOpacity>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currencyList != this.props.currencyList) {
            this.state = {
                currencySource: this.ds.cloneWithRows(nextProps.currencyList),
            };
        }
    }

    render() {
        let height = this.props.currencyList.length < 5 ? this.props.currencyList.length*50+2+28+44 : 280;
        return (
            <Modal ref="popup" style={[styles.container, {height: height}]}
                   position="bottom"
                   backButtonClose={true}
                   onOpened={this.props.onOpened}
                   onClosed={this.props.onClosed}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>选择币种 </Text>
                        <Text style={styles.titleRight}>当前汇率</Text>
                    </View>
                    <HorizontalLine />
                </View>
                <ListView style={styles.currencyList}
                          dataSource={this.state.currencySource}
                          renderRow={this.renderRow}
                          //renderHeader={this.renderHeader}
                          renderSeparator={this.renderSeparator}/>
                <HorizontalLine />
                <Button containerStyle={styles.cancelButtonContainer} style={styles.cancelButtonText} onPress={this.close}>
                    取消
                </Button>
            </Modal>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor:'#fff',
        width:Dimensions.get('window').width,
    },
    currencyList: {
        flex: 1,
        //height: 200,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#ffffff',
    },
    currencyIcon: {
        width: 50,
        height: 30,
        marginLeft: 10,
    },
    currencyName: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 15,
        color: '#333333',
    },
    currencyRate: {
        marginRight: 12,
        fontSize: 15,
        color: '#333333',
    },
    header: {
        justifyContent: 'flex-end',
        height: 28,
        backgroundColor: '#ffffff',
    },
    titleContainer: {
        flexDirection: 'row',
    },
    title: {
        flex: 1,
        marginLeft: 10,
        marginBottom: 2,
        fontSize: 15,
        color: '#666666',
    },
    titleRight: {
        marginRight: 10,
        marginBottom: 2,
        fontSize: 15,
        color: '#999999',
    },
    cancelButtonContainer: {
        height:44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        color:'#666',
        fontWeight :'normal',
        fontSize:16
    },
});