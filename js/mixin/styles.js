/**
 * Created by wangyu on 2016/10/28.
 */
import {
    Dimensions
} from 'react-native';
import StyleSheet from 'StyleSheet';
export default StyleSheet.create({
    modal:{
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:4
    },
    modalBackground:{
        backgroundColor:'#fff'
    },
    modalPopupTitle:{
        height:44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalFullWidth:{
        width:Dimensions.get('window').width
    },
    popupButton:{
        textAlign:'center',
        fontSize:14,
        color:'#333'
    },
    modalContent:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft:20,
        paddingRight:20,
        paddingTop:18,
        paddingBottom:33
    },
    modalAlert:{
        paddingTop:13,
        paddingBottom:23,
        width:Dimensions.get('window').width*(1-0.134)
    },
    modalButtons:{
        flexDirection:"row",
    },
    modalButtonText:{
        color:'#157efb',
        fontWeight :'normal',
        fontSize:14
    },
    modalButtonCancel:{
        color:'#333',
        fontWeight :'normal',
        fontSize:14
    },
    modalFullButton:{
        width:Dimensions.get('window').width*(1-0.134),
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalTitle:{
        paddingTop:5,
        width:300,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalConfirm:{
        paddingTop:13,
        paddingBottom:23,
        width:Dimensions.get('window').width*(1-0.134)
    },
    confirmTitle:{
        color:'#333',
        fontSize:16,
    },
    modalCancel:{
        width:Dimensions.get('window').width*(1-0.134)/2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalSubmit:{
        width:Dimensions.get('window').width*(1-0.134)/2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalPopup:{
        backgroundColor:"transparent",
        width:Dimensions.get('window').width
    },
    modalPopupList:{
        //flex:1,
        backgroundColor:'#fff',
        //justifyContent:'center'
    },
    modalToast:{
        backgroundColor:"transparent",
        width:Dimensions.get('window').width-60
    },
    modalToastContent:{
        backgroundColor: '#303030',
        borderRadius: 4,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 40,
        paddingRight: 40
    },
})