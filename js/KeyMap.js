/**
 * Created by wangyu on 2016/11/14.
 */

const keyMap = {
    0: {
        type: "number",
        text: "0"
    },
    1: {
        type: "number",
        text: "1"
    },
    2: {
        type: "number",
        text: "2"
    },
    3: {
        type: "number",
        text: "3"
    },
    4: {
        type: "number",
        text: "4"
    },
    5: {
        type: "number",
        text: "5"
    },
    6: {
        type: "number",
        text: "6"
    },
    7: {
        type: "number",
        text: "7"
    },
    8: {
        type: "number",
        text: "8"
    },
    9: {
        type: "number",
        text: "9"
    },
    dot: {
        type: "dot",
        text: ".",
        icon: require('./asset/dot.png')
    },
    "delete": {
        type: "delete",
        text: "Del",
        icon: require('./asset/delete.png')
    },
    "clear": {
        type: "clear",
        text: "C",
        icon: require('./asset/C.png')
    },
    "tab": {
        type: "tab",
        text: "Tab",
        icon: require('./asset/tab.png')
    },
    "blank": {
        type: "blank",
        text: " "
    }
};

export default keyMap;