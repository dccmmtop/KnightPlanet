import React, { PureComponent } from 'react'
import { NativeModules, KeyboardAvoidingView, Keyboard, View, Text, Alert, BackHandler, Platform, TextInput, StyleSheet, StatusBar, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import { NavigationActions } from 'react-navigation';
import forge from 'node-forge'

import Button from '../../widget/Button'
import commonStyles from '../../commonStyle'
import screen from '../../common/screen'
import color from '../../widget/color'
import CountTime from '../../widget/CountTime'
import { toastShort } from '../../widget/Toast'

import api from '../../api'
import Request from '../../common/request'

const { width } = Dimensions.get('window')
const phoneVolid = /^1\d{10}$/; // 验证手机号为1开头的11位数
const codeVolid = /\d{4}$/; // 验证验证码为4位数
class Login extends PureComponent {
  // 页面头部
  static navigationOptions = (navigation) => ({
    headerTitle: (
      <View>
        <StatusBar barStyle="dark-content"/>
      </View>
    ),
    headerLeft: null,
    headerStyle: {
      height: 44,
      backgroundColor: '#ffffff',
      elevation: 0,
      borderBottomWidth: 0
    },
  })

  constructor() {
    super()
    this.state = {
      phoneNumber: '', // 手机号码
      volidCode: '', // 验证码
      btnIsable: null, //登陆按钮是否可点
      getCodeResult: false // 获取验证码是否成功
    }
    this._onBackAndroidLogin = this._onBackAndroidLogin.bind(this);
  }
  componentDidMount() {
    if (Platform.OS === 'android') {
      // 登录页面对返回键的监听
      BackHandler.addEventListener('hardwareBackPress', this._onBackAndroidLogin);
    } else {
      // 获取设备token
      storage.load({
        key: 'token',
        syncInBackground: true
      }).then(ret => {
        global.token = ret
      }).catch(err => {
        console.log(err)
      })
    }
  }
  // 2秒内再按一次推出程序
  _onBackAndroidLogin = () => {
    if (this.props.navigation.state.routeName != 'Login') {
      this.navigator.pop();
      return true;
    }
    if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
      //最近2秒内按过back键，可以退出应用。
      BackHandler.exitApp();
      return true;
    }
    this.lastBackPressed = Date.now();
    toastShort('再按一次退出应用');
    return true;
  };
  componentWillUnmount() {
    // 只监听登录页面的返回键，其他页面的不监听
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this._onBackAndroidLogin);
    }
  }
  
  // 调用原生模块上传位置
  _locationServer(authorization) {
    let KpLocationService = NativeModules.KpLocationService;
    KpLocationService.startService(authorization);
  }
    /**
     * 登录请求
     * 如果直接绑定 async 的方法，相当于把当前场景this和这个方法绑定在一起了
     * this当前场景就到了async内部，但是由于async方法内部被语法糖转换成了同步柱塞模式，所以就ui柱塞了
     *  async 外部是异步的，所以如果要用，就包装一层。要么就不要绑定this
     * @returns {Promise.<void>}
     *
     * @private
     */
  _sendData = async(para, headers, navigation) => {
      const res = await Request.post(this.props.navigation, api.userLogin, JSON.stringify(para), headers);
      if (res.ok) {
          //登录成功
          const loginInfo = {
              loginState: true,
              Authorization: JSON.parse(res._bodyInit).result
          }
          // android调取原生定位模块
          if(Platform.OS === 'android') {
            this._locationServer(JSON.parse(res._bodyInit).result);
          }
          storage.save({
              key: 'loginInfo',
              data: loginInfo
          })
          global.user = loginInfo;
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'OrderReceive' })],
          });
          navigation.dispatch(resetAction);
      } else {
          // 登录失败
          toastShort('登录失败：' + JSON.parse(res._bodyInit).message);
      }
  }

  /**
   * 登录
   * @private
   */
  _requestData() {
    // 检查手机号和验证码是否符合规定
    if (!phoneVolid.test(this.state.phoneNumber)) {
      toastShort('请输入正确的手机号~')
    } else if (!codeVolid.test(this.state.volidCode)) {
      toastShort('验证码不正确~')
    } else {
      // 调用登录接口
      const para = {
        mobile: this.state.phoneNumber,
        deviceToken: global.token,
        validateCode: this.state.volidCode,
        deviceType: Platform.OS
      }
      // 头部定义
      const headers = new Headers({
        'appKey': '1000',
        'sign': this._md(para),
        'Content-Type': 'application/json',
      });
      try {
        this._sendData(para, headers, this.props.navigation);
      } catch (err) {
        // 登录失败
        toastShort('登录失败：' + err);
      }
    }
  }
  // MD5加密
  _md(para) {
    const sign = 'appKey=1000&appSecret=8Vp9j3SBot9ZXj1Ef77jvRpbsUr5HCCo&body=' + JSON.stringify(para)
    let md = forge.md.md5.create();
    md.update(sign);
    const mdStr = md.digest().toHex();
    return mdStr
  }
  render() {
    if(phoneVolid.test(this.state.phoneNumber) && codeVolid.test(this.state.volidCode)) {
      Keyboard.dismiss();
    }
    const btnIsable = (this.state.phoneNumber !== '' && this.state.volidCode !== '') ? true : false
    return (
      <View style={[commonStyles.container, styles.login_contain]}>
        <View style={[commonStyles.itemCol]}>
          <View style={styles.title_box}>
            <Text style={styles.login_title}>登录</Text>
          </View>
          <KeyboardAvoidingView behavior='padding' style={[styles.login_info, commonStyles.itemCol]}>
            <Text style={styles.font1}>手机号码</Text>
            <View style={styles.input_box}>
              <TextInput
                style={styles.textinput}
                maxLength={11}
                keyboardType='numeric'
                placeholder='请输入手机号码'
                placeholderTextColor='#c0c0c0'
                underlineColorAndroid='transparent'
                onChangeText={(text) => this.setState({ phoneNumber: text })}
              >
              </TextInput>
              <CountTime
                style={styles.code_box}
                codeStyle={styles.code}
                avtiveCodestyle={{ fontSize: 15, color: '#999999' }}
                totalTime={60}
                title='发送验证码'
                phoneNumber={this.state.phoneNumber}
                navigation={this.props.navigation}
              />
            </View>
            <Text style={styles.font1}>验证码</Text>
            <View style={styles.input_box}>
              <TextInput
                style={styles.textinput}
                maxLength={6}
                keyboardType='numeric'
                placeholder='请输入收到的验证码'
                placeholderTextColor='#c0c0c0'
                underlineColorAndroid='transparent'
                onChangeText={(text) => this.setState({ volidCode: text })}
              >
              </TextInput>
            </View>
            <Button
              disabled={!btnIsable}
              style={[commonStyles.primaryBtn1, styles.login_btn]}
              titleStyle={commonStyles.pbton} 
              title='登录'
              onPress={this._requestData.bind(this)}
              opacity={btnIsable ? 1 : 0.4}
            />
          </KeyboardAvoidingView>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  login_contain: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
  },
  title_box: {
    width: '100%',
    height: 80
  },
  login_title: {
    fontSize: 24,
    color: color.importantFont,
    textAlign: 'center'
  },
  login_info: {
    width,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 50
  },
  font1: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 10
  },
  font2: {
    fontSize: 15,
    color: color.primary
  },
  font3: {
    fontSize: 15,
    color: '#999999'
  },
  input_box: {
    width: '100%',
    justifyContent: 'center',
    height: 60,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: color.border
  },
  textinput: {
    width: '100%',
    fontSize: 22,
    color: color.importantFont,
    padding: 0, // 去掉安卓上面默认padding
  },
  code_box: {
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    height: '100%'
  },
  code: {
    fontSize: 15,
    color: color.primary
  },
  login_btn: {
    width: '100%',
    marginTop: 10
  },
  btn_opacity: {
    opacity: .4
  }
})


export default Login
