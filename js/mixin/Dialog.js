import React, {Component}from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    Keyboard,
} from 'react-native';
import StyleSheet from 'StyleSheet';
import styles from './styles';
import words from '../asset/words';

var Modal = require("react-native-modalbox");
import Button from "react-native-button";

export let Dialog = ComponsedComponent => class extends React.Component {

    constructor(props) {
        super(props);

        this.defaultConfig = {
            alert:{
                content:"提示信息",
                submitText:words.button.submit,
                onSubmit:null,
                height:110,
            },
            confirm:{
                title:"提示",
                content:"确认删除吗？",
                hideTitle:false,
                cancelText:words.button.cancel,
                submitText:words.button.submit,
                onCancel:null,
                onSubmit:null,
                flag:0,
            },
            popup:{
                title:"选择",
                hideTitle:false,
                cancelText:words.button.cancel,
                onSubmit:null,
                height:null,
                buttons:null,
            },
            toast:{
                width:206,
                height:45,
                onClosed:null,
                timeout:2000,
            }
        };

        this.state = {
            alertConfig:{...this.defaultConfig.alert},
            confirmConfig:{...this.defaultConfig.confirm},
            popupConfig:{...this.defaultConfig.popup},
            toastConfig:{...this.defaultConfig.toast},
            bottom:0,
            storeBottom:0//存储传过来的bottom，
        };

    }
    componentDidMount(){
        if (Platform.OS == "android") {
            this._listeners = [
                Keyboard.addListener('keyboardDidShow', this.updateKeyboardSpace.bind(this)),
                Keyboard.addListener('keyboardDidHide', this.resetKeyboardSpace.bind(this))
            ];
        } else {
            this._listeners = [
                Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace.bind(this)),
                Keyboard.addListener('keyboardWillHide', this.resetKeyboardSpace.bind(this))
            ];
        }

    }
    componentWillUnmount(){
        this._listeners && this._listeners.forEach(function(listener) {
            listener.remove();
        });
    }
    //弹出键盘
    updateKeyboardSpace(frames){
        if (!frames.endCoordinates)
            return;
        this.setState({
            bottom:this.state.storeBottom
        })
    }
    //隐藏键盘
    resetKeyboardSpace(){
        this.setState({
            bottom:0
        })
    }
    popup(opts) {
        var config = this.defaultConfig.popup;
        config = Object.assign(config, opts);

        if(opts.buttons) {
            config.content = opts.buttons.map((item, index) => {
                return (
                    <TouchableOpacity key={index} onPress={()=>this.popupClickHandler(item.value)}>
                        <View style={[styles.modalPopupTitle, styles.modalFullWidth, {borderTopWidth:StyleSheet.hairlineWidth, borderTopColor:'#dfdfdf'}]}>
                            <Text style={[styles.modalFullWidth, styles.popupButton]}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                );
            });
        }
        else if(typeof opts.content != 'undefined') {
            config.content = opts.content;
        }

        this.setState({
            popupConfig:config
        }, function() {
            this.refs.popup.open();
        }.bind(this));

        return this.refs.popup;
    }

    popupClickHandler(type) {
        var result = true;
        if(this.state.popupConfig.onSubmit) {
            result = this.state.popupConfig.onSubmit.call(null, type);
        }
        result === true && this.refs.popup.close();
    }

    popupCancel() {
        this.refs.popup.close();
    }

    alert(opts) {
        var config = this.defaultConfig.alert;
        //现在如果需要设置高度，请用_height，不支持用height设置高度
        opts && (opts.height = undefined);

        config = Object.assign(opts, config);

       // console.log("Dialog alert",config);
        let _this = Data.currentDialogThis || this;
        if(opts.content) {
            if(typeof opts.content == 'string') {
                config.content = <Text style={{fontSize:14}}>{opts.content}</Text>;
            }else {
                config.content = opts.content;
            }
        }
        else{
            config.content = <Text style={{fontSize:14}}>操作失败,请重试!</Text>;
        }

        if(opts.submitText) {
            config.submitText = opts.submitText;
        }

        if (opts.onSubmit) {
            config.onSubmit = opts.onSubmit;
        }

        if(opts._height) {
            config.height = opts._height;
        }
        //console.warn("Dialog",_this);

        _this.setState({
            alertConfig:config
        }, function() {
            _this.refs.alert.open();
        })
    }

    alertSubmit() {
        this.refs.alert.close();
        this.state.alertConfig.onSubmit && this.state.alertConfig.onSubmit.call();
    }

    confirm(opts) {
        var config = this.defaultConfig.confirm;
        //现在如果需要设置高度，请用_height，不支持用height设置高度
        opts && (opts.height = undefined);

        config = Object.assign(opts, config);
        let _this = Data.currentDialogThis || this;

        if(typeof config.content == 'string') {
            config.content = <Text style={{fontSize:14}}>{opts.content}</Text>;
        }

        if(opts._height) {
            config.height = opts._height + 42;//42是底部button和下边距的高度
        }

        //if(typeof opts.height == 'undefined') {
        //    if(config.hideTitle) {
        //        config.height = 100;
        //    }else {
        //        config.height = 140;
        //    }
        //}

        _this.setState({
            confirmConfig:config,
            bottom:config.bottom || 0,
            storeBottom:config.bottom || 0
        }, function() {
            _this.refs.confirm.open();
        })
    }

    confirmCancel() {
        this.refs.confirm.close();

        this.state.confirmConfig.onCancel && this.state.confirmConfig.onCancel.call();
    }

    confirmSubmit() {

        if(this.state.confirmConfig.flag != 1){
            this.refs.confirm.close();
        }

        this.state.confirmConfig.onSubmit && this.state.confirmConfig.onSubmit.call();
    }


    toast(opts) {
        var config = this.defaultConfig.toast;
        config = assign(opts, config);

        if(opts.content) {
            if(typeof opts.content == 'string') {
                config.content = <Text style={{fontSize:14, color:'#ffffff'}}>{opts.content}</Text>;
            }else {
                config.content = opts.content;
            }
        }

        if (opts.timeout) {
            config.timeout = opts.timeout;
        }

        this.setState({
            toastConfig:config
        }, function() {
            this.refs.toast.open();
            setTimeout(() => {
                this.refs && this.refs.toast && this.refs.toast.close();
            }, this.state.toastConfig.timeout);
        }.bind(this));

    }


    updateState(){
        this.setState();
    }


    render() {
        return <View style={{flex:1}}>
            <ComponsedComponent {...this.props} {...this.state} modal={this}/>
            {/*commented by CoolGuy on 2016.07.01 自适应的主要代码是height===undefined,此时react-native-modal的高度就是采用的内容本身的高度*/}
            <Modal ref="alert" style={[styles.modal,styles.modalAlert, {height:this.state.alertConfig.height}]} position={"center"} onClosed={this.state.alertConfig.onClosed}>
                <View style={[styles.modalContent]}>
                    {this.state.alertConfig.content}
                </View>
                <View style={styles.modalButtons}>
                    <Button containerStyle={styles.modalFullButton} style={styles.modalButtonText} onPress={this.alertSubmit.bind(this)}>{this.state.alertConfig.submitText}</Button>
                </View>
            </Modal>
            <Modal ref="confirm" style={[styles.modal,{bottom:this.state.bottom}, styles.modalConfirm, {height:this.state.confirmConfig.height}]} position="center" onClosed={this.state.confirmConfig.onClosed}>
                {!this.state.confirmConfig.hideTitle && <View style={styles.modalTitle}>
                    <Text style={[styles.modalButtonText,styles.confirmTitle]}>{this.state.confirmConfig.title}</Text>
                </View>}
                <View style={[styles.modalContent,this.state.confirmConfig.newStyle]}>
                    {this.state.confirmConfig.content}
                </View>
                <View style={styles.modalButtons}>
                    <Button containerStyle={styles.modalCancel} style={styles.modalButtonCancel} onPress={this.confirmCancel.bind(this)}>{this.state.confirmConfig.cancelText}</Button>
                    <Button containerStyle={styles.modalSubmit} style={styles.modalButtonText} onPress={this.confirmSubmit.bind(this)}>{this.state.confirmConfig.submitText}</Button>
                </View>
            </Modal>
            <Modal ref="popup" style={[styles.modal, styles.modalPopup, {height:this.state.popupConfig.height}]} position="bottom" onClosed={this.state.popupConfig.onClosed}>
                {!this.state.popupConfig.hideTitle && <View style={[styles.modalBackground, styles.modalPopupTitle, styles.modalFullWidth]}>
                    <Text style={[styles.modalButtonText, {color:'#999'}]}>{this.state.popupConfig.title}</Text>
                </View>}
                <View style={[styles.modalFullWidth, styles.modalPopupList]}>
                    {this.state.popupConfig.content}
                    <Button containerStyle={[styles.modalFullButton, styles.modalFullWidth, {height:44,borderTopWidth:StyleSheet.hairlineWidth, borderTopColor:'#dfdfdf'}, this.state.popupConfig.cancelContainerStyle]} style={[styles.modalButtonText, this.state.popupConfig.cancelStyle]} onPress={this.popupCancel.bind(this)}>{this.state.popupConfig.cancelText}</Button>
                </View>
                {/*<View style={[styles.modalFullWidth, styles.modalButtons, styles.modalBackground, {marginTop:5}]}>

                </View>*/}
            </Modal>
            <Modal ref="toast" style={[styles.modal, styles.modalToast]} backdropOpacity={0} position="center" onClosed={this.state.toastConfig.onClosed}>
                <View style={styles.modalToastContent}>
                    {this.state.toastConfig.content}
                </View>
            </Modal>
        </View>;
    }
};