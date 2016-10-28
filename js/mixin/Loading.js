import React, { Component } from 'react';
import {
    NetInfo,
    View,
    Text,
    Image,
    Platform,
    Dimensions,
    Animated
} from 'react-native';
import StyleSheet from 'StyleSheet';
import styles from './styles';
import words from '../asset/words';;

export let Loading = ComponsedComponent => class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show:false,
            text:words.loading.default,
            headerHeight:Platform.OS == 'ios' ? 20 : 0,
            rotateValue:new Animated.Value(0)
        };
    }

    show(text,time) {
        var newTime = time||25;
        setTimeout(function() {
            this.setState({
                show:true,
                text:text || "加载中…"
            });
        }.bind(this), 0);

        Animated.timing(
            this.state.rotateValue, {
                duration:1000 * newTime,
                toValue:1000 * newTime
            }
        ).start(()=>this.hide());
    }

    hide() {
        try {
            this.setState({
                show: false,
                text: ""
            });
        }catch(e) {

        }
    }

    componentDidMount() {

    }

    componentWillMount() {
    }

    render() {
        return <View style={{flex:1}}>
            <ComponsedComponent {...this.props} {...this.state} loading={this} ref="main"/>
            {!!this.state.show && (
                <View style={[loadingStyle.centerLoading]}>
                    <View style={loadingStyle.content}>
                        <Animated.Image
                            source={require("../asset/loading.png")}
                            style={[
                                loadingStyle.loadingImage,
                                {transform:[{rotate:this.state.rotateValue.interpolate({
                                    inputRange:[0,720],
                                    outputRange:['0deg', '360deg']
                                })}]}
                            ]} />
                        <Text style={loadingStyle.loadingText}>{this.state.text}</Text>
                    </View>
                </View>
            )}
        </View>;
    }
};

const loadingStyle = StyleSheet.create({
    centerLoading:{
        position:'absolute',
        top:0,
        left:0,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
        backgroundColor:'transparent',
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row"
    },
    content:{
        width:109,
        height:109,
        backgroundColor:"rgba(0, 0, 0, 0.8)",
        borderRadius:4,
        justifyContent:"center",
        alignItems:"center",
    },
    loadingImage:{
        width:40,
        height:40
    },
    loadingText:{
        fontSize:15,
        color:'#fff',
        marginTop:15
    }
});