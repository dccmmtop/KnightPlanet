// 转单模态框
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import commonStyles from '../../../commonStyle';
import color from '../../../widget/color';
import RadioGroup  from '../../../widget/RadioGroup';
import {toastShort} from '../../../widget/Toast'
import Request from '../../../common/request';
import api from '../../../api';
import URLSearchParams from 'url-search-params';

type Props = {
    visible: boolean, // 模态框是否可见
    modalData: Array, // 模态框数据
    refreshFunc: Function, // 刷新待接单列表函数
}
class TransModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data, // 配送员列表数据
            visible: props.visible,
            courierId: '', // 被选择的配送员号
        };
        this._cancle = this._cancle.bind(this);
        this._confirm = this._confirm.bind(this);
        this._selectChange = this._selectChange.bind(this);
        this.obj2String = this.obj2String.bind(this);
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            data: newProps.data,
            visible: newProps.visible
        })
    }
    componentWillUnmount() {
        this.setState({
            visible: false,
            courierId: ''
        });
        this.props.transVisible(false);
    }
    // 取消
    _cancle() {
        this.setState({
            visible: false,
            courierId: ''
        });
        this.props.transVisible(false);
    }
    // 单选按钮选择
    _selectChange(index, item) {
        this.setState({
            courierId: item.courierId
        })
    }
    // 确定转单
    _confirm() {
        const headers = new Headers({
            'Authorization': global.user.Authorization,
            'Content-Type': 'application/x-www-form-urlencoded'
          });
        const para = {
            orderId: this.props.orderId,
            courierId: this.state.courierId
        }
        Request.post(this.props.navigation, api.switchOrder, this.obj2String(para), headers)
        .then(res => {
            this.props.transVisible(false);
            if(res.ok) {
                toastShort('转单成功~');
                setTimeout(() => {
                    this.props.refreshFunc()
                  }, 1000)
            } else {
                toastShort(JSON.parse(res._bodyInit).message);
            }
        }).catch( err => {
            console.log(err);
        })
        this.setState({
            visible: false,
            courierId: ''
        });
    }
    /**
     * 将对象转成 a=1&b=2的形式
     * @param obj 对象
     */
    obj2String(obj, arr = [], idx = 0) {
        for (let item in obj) {
        arr[idx++] = [item, obj[item]]
        }
        return new URLSearchParams(arr).toString()
    }
    render() {
        let { data, orderId, visible, courierId} = this.state;
        let opacity = this.state.courierId ? 1 : .4;
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={visible}
                onRequestClose={this._cancle}
                >
                <View style={[styles.wrapper]}>
                    <View style={styles.innerWrapper}>
                        <View style={styles.title}>
                            <Text style={[commonStyles.font6, {paddingTop: 30, paddingBottom: 30}]}>选择配送员</Text>
                        </View>
                        <View style={styles.container}>
                            {data.length ? (
                                <ScrollView>
                                    <View style={styles.contain}>
                                        <View style={styles.containItem}>
                                            {
                                                data.map((item, index) => {
                                                    return <View key={`name${index}`} style={styles.listItem}><Text style={styles.font1}>{item.name}</Text></View>
                                                })
                                            }
                                        </View>
                                        <View style={styles.containItem}>
                                            {
                                                data.map((item, index) => {
                                                return  <View key={`dist${index}`} style={styles.listItem}><Text style={styles.font2}><Text>{item.distance}</Text><Text>km</Text></Text></View>
                                                })
                                            } 
                                        </View>
                                        <View style={[styles.containItem]}>
                                            <View style={{position: 'absolute', right: 5}}>
                                                <RadioGroup
                                                    style={{flex: 1, flexDirection: 'column',}}//整个组件的样式,可以垂直和水平
                                                    conTainStyle={{height: 55, width: 275, justifyContent: 'flex-end'}}//图片容器样式
                                                    imageStyle={{width: 20, height: 20}}//图片样式
                                                    textStyle={{color: 'black'}}//文字样式
                                                    selectIndex={''}//空字符串,表示不选中,数组索引表示默认选中
                                                    data={this.state.data}//数据源
                                                    onPress={(index, item)=> this._selectChange(index, item)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                                ) : (<View style={styles.noPerson}><Text style={styles.noText}>暂无可以转单的人员~</Text></View>)
                            }
                        </View>
                        <View style={styles.btnBox}>
                            <TouchableOpacity style={styles.cancleBtn} onPress={this._cancle}>
                                <Text style={styles.cancleText}>取消</Text>
                            </TouchableOpacity>
                            {data.length ? (
                                <View
                                    style={styles.confirmBox}
                                    opacity={opacity}
                                >
                                    <TouchableOpacity
                                        style={styles.confirmBtn}
                                        onPress={this._confirm}
                                        disabled={courierId ? false : true}
                                    >
                                        <Text style={styles.confirmText}>转给他</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    innerWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 37.5,
        marginRight: 37.5,
        backgroundColor: '#ffffff'
    },
    titile: {
        flexDirection: 'row',
    },
    container: {
        width: "100%",
        paddingLeft: 15,
        paddingRight: 15,
        maxHeight: 250
    },
    contain: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containItem: {
        flexDirection: 'column',
    },
    listItem: {
        height: 55,
        justifyContent: 'center',
    },
    font1: {
        fontSize: 14,
        color: color.importantFont
    },
    font2: {
        fontSize: 12,
        color: '#999999'
    },
    btnBox: {
        flexDirection: 'row',
        height: 55,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5'
    },
    cancleBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#e5e5e5'
    },
    confirmBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color.primary
    },
    confirmBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancleText: {
        fontSize: 16,
        color: '#999999'
    },
    confirmText: {
        fontSize: 16,
        color: '#ffffff',
       
    },
    noPerson: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 55
    },
    noText: {
        fontSize: 14,
        color: '#999999'
    }
})

export default TransModal