/**
 * Created with kp
 * User: chenxingliang/labidc@gmail.com
 * Date: 2018/3/27
 * Time: 10:02
 *
 */

import React, { PureComponent } from 'react';
import {  NativeModules, DeviceEventEmitter, Text, View, TouchableOpacity } from 'react-native';

/**
 * 用户中心场景
 */
export default class Demo extends PureComponent {

    /**
     * 构造函数
     * @param props
     */
    constructor(props) {
        super(props)
        this._onPressButton = this._onPressButton.bind(this);
        DeviceEventEmitter.addListener('XingGeMsg', this.NativeToJs);
    }

    /**
     * 准备挂载之前
     */
    componentWillMount() {


    }

    /**
     * 处理原生发送消息到js,需要上面的代码监听, 主要是用于消息来之后，用户点击之后发送过来的调用该位置
     */
    NativeToJs(event){
        //原生发送过来的消息
      console.log(event);
    }




    /**
     * js调用原生
     * @constructor
     */
    JsToNative(){


        let XingGe = NativeModules.XingGe;


        //=============================1.绑定当前用户和token的关系，token不用管，由原生处理。
        let userName = "17729881993";//比如登录账号，手机号，邮箱都可以
        //绑定当前token和当前用户id
        XingGe.bindAccountCallBack(
            userName,
            (msg) => {
                //绑定成功的回调
                console.log(msg);
            },
            (error) => {
                //绑定失败的回调
                console.log(error);
            }
        );
        //=============================1.绑定当前用户和token的关系



        //=============================2.绑定当前用户和token的关系，token不用管，由原生处理。
         userName = "17729881993";//比如登录账号，手机号，邮箱都可以
        //绑定当前token和当前用户id
         XingGe.bindAccount(userName);
        //=============================2.这个是不需要回调的版本





        //=============================3.设置当前token对应的tag
        let tag = "普通用户组";//tag属于一种分组模式
        XingGe.setTag(userName);
        //=============================3.到时候可以根据分组来发送消息



        //=============================4.获取当前运行手机的token
        XingGe.getToken(
            (token) => {
                //token
                console.log(token);
            },
            (error) => {
                //获取失败
                console.log(error);
            }
        );
        //=============================4.获取当前运行手机的token

    }


    /**
     * 点击
     * @private
     */
    _onPressButton(){
        this.JsToNative();
    }

    /**
     * 控件更新vdom完成后
     */
    componentDidUpdate() {
        //this.JsToNative();
    }
    /**
     * 渲染函数
     * @returns {XML}
     */
    render() {
        return(
            <View>
                <TouchableOpacity onPress={this._onPressButton}>
                   <Text>测试</Text>
                </TouchableOpacity>
            </View>
        )
    }


}