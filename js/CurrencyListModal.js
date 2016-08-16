/**
 * Created by wangyu on 2016/8/2.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Modal,
    TouchableOpacity,
    Dimensions,
    ListView,
    InteractionManager
} from 'react-native';

import HorizontalMarginLine from './common/HorizontalMarginLine';
import HorizontalLine from './common/HorizontalLine';
import {changeShowList} from './actions/currency';

export default class CurrencyListModal extends Component {


    // 构造
    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });

        // 初始状态
        this.state = {
            currencySource: this.ds.cloneWithRows(this.props.currencyList),
            visible: false,
        };

        this.selectLine = 0;

        this.renderRow = this.renderRow.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
    }


    show(selectLine) {
        this.setState({
            visible: true,
        });

        this.selectLine = selectLine;
    }

    onListItemClick(index) {
        this.setState({
            visible: false,
        });

        this.props.dispatch(changeShowList(this.selectLine, index));
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

    render() {
        return (
            <Modal animationType="fade"
                   transparent={true}
                   visible={this.state.visible}
                   onRequestClose={() => {console.warn("onRequestClose")}}>

                <TouchableOpacity style={styles.container}
                                  activeOpacity={1.0}
                                  onPress={() => this.setState({visible: false})}>

                    <ListView style={styles.currencyList}
                              dataSource={this.state.currencySource}
                              renderRow={this.renderRow}
                              renderHeader={this.renderHeader}
                              renderSeparator={this.renderSeparator}/>
                </TouchableOpacity>


            </Modal>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    currencyList: {
        flex: 1,
        marginTop: 30,
        marginBottom: 30,
        marginLeft: 30,
        marginRight: 30,
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
    title: {
        marginLeft: 10,
        marginBottom: 2,
        fontSize: 15,
        color: '#666666',
    }
});