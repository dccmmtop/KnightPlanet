import React, {Component} from 'react'
import {
  NativeModules,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  DeviceEventEmitter
} from 'react-native'
import {
  Toast,
  Flex
} from 'antd-mobile'
import Modal from "react-native-modal";
import commonStyles from '../../commonStyle'
import screen from '../../common/screen'
import color from '../../widget/color'
import DetailCell from './DetailCell'
import { toastShort } from '../../widget/Toast'

import api from '../../api'
import Request from '../../common/request'
import SwitchSelector from '../../widget/SwitchSelector'

class PersonalCenter extends Component {
  // 页面头部
  static navigationOptions = (navigation) => ({
    title: null
  })

  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false,
      isFirst: true, // 是否是首次加载
      isRefreshing: false,
      userData: {},
      onlineState: null, // 0为开工，1为收工
    }
    this._onHeaderRefresh();
    this._changeWorkState = this._changeWorkState.bind(this);
    this._onLine = this._onLine.bind(this);
    this._offLine = this._offLine.bind(this);
    this._cancel = this._cancel.bind(this);
  }
  componentDidMount() {
  }
  _cancel() {
    this.setState({ 
      isModalVisible: false,
      onlineState: 0 
    })
  }
  // 获取用户数据
  _requestData() {
    Request.get(this.props.navigation, api.userDate)
      .then((res) => {
        if (res.ok) {
          const data = JSON.parse(res._bodyInit);
          const userData = {
            courierMobile: data.courierMobile,
            orderCount: data.orderCount,
            totalDistance: (data.totalDistance / 1000) > 0 ? (data.totalDistance / 1000).toFixed(1) : data.totalDistance / 1000,
            courierSettleAmount: data.courierSettleAmount > 0 ? (data.courierSettleAmount).toFixed(1) : data.courierSettleAmount,
            courierName: data.courierName
          }
          this.setState({
            userData,
            isFirst: data.onlineState ? false : true,
            onlineState: data.onlineState ? 0 : 1,
            isRefreshing: false
          })
        }
      }).catch(err => {
        console.log(err)
      })
  }
  // 下拉刷新
  _onHeaderRefresh() {
    this.setState({ isRefreshing: true })
    this._requestData();
  }
  // 快递员开工/收工
  _changeWorkState(value) {
    // debugger;
    if(this.state.onlineState && value === 'offline' || !this.state.onlineState && value === 'online') {
      // 什么都不做
    } else {
      if(value === 'offline') {
        if(this.state.isFirst) {
          this.setState({
            isFirst: false
          })
        } else {
          this.setState({ 
            isModalVisible: true,
            onlineState: 1
          })
        }
      } else {
        this._onLine()
      }
    }
  }
  // 开工
  _onLine() {
    Request.put(this.props.navigation, api.onLine)
    .then((res) => {
      if (res.ok) {
        // 接口请求成功
        Toast.info(`当前为开工状态~`, 1.5);
        setTimeout(() => {
          this._requestData();
          DeviceEventEmitter.emit('orderReceive');
        }, 1000)
      } else {
        toastShort(JSON.parse(res._bodyInit).message);
      }
    }).catch(err => {
      toastShort(err)
    })
  }
  // 收工
  _offLine() {
    this.setState({ isModalVisible: false })
    Request.put(this.props.navigation, api.offLine)
    .then((res) => {
      if (res.ok) {
        // 接口请求成功
        Toast.info(`当前为收工状态~`, 1.5);
        setTimeout(() => {
          this._requestData();
          DeviceEventEmitter.emit('orderReceive');
        }, 1000)
      } else {
        toastShort(JSON.parse(res._bodyInit).message);
      }
    }).catch(err => {
      toastShort(err)
    })
  }
  // 列表项点击跳转
  _onCellSelected(linkRouter) {
    if (linkRouter == 'Login') {
      // 退出登录
      storage.remove({
        key: 'loginInfo'
      });
      global.user = {
        loginState: false,//登录状态 
        Authorization: '' // 接口请求头部签名
      }
      global.jumpNum = 0;
      clearInterval(global.timeID); // 清楚定时器
      if(Platform.OS === 'android') {
        this._stopLocationServer(); // 关闭位置上传服务
      }
    }
    StatusBar.setBarStyle('default', false)
    linkRouter ? this.props.navigation.navigate(linkRouter) : ''
  }
  // 退出登录调用原生模块关闭位置上传服务
  _stopLocationServer() {
    let KpLocationService = NativeModules.KpLocationService;
    KpLocationService.stopService();
  }
  // 操作项配置
  _getDataList() {
    return (
      [
        { title: '历史订单', subtitle: '历史订单', iconImg: require('../../img/arr_right.png'), iconStyle: styles.icon1, linkRouter: 'HistoryOrder' },
        // {title: '历史战绩', subtitle: '历史战绩', iconImg: require('../../img/arr_right.png'), iconStyle: styles.icon1, linkRouter: 'HistoryOrder'},
        { title: '退出登录', iconImg: require('../../img/ic_out.png'), iconStyle: styles.icon2, linkRouter: 'Login' }
      ]
    )
  }
  // 打印操作列表
  _renderCells() {
    let cells = []
    let dataList = this._getDataList()
    for (let j = 0; j < dataList.length; j++) {
      let data = dataList[j]
      let cell = <DetailCell index={j} onPress={() => this._onCellSelected(data.linkRouter)} title={data.title} subtitle={data.subtitle} iconImg={data.iconImg} iconStyle={data.iconStyle} key={data.title} />
      cells.push(cell)
    }

    return (
      <View style={{ flex: 1, marginTop: 10 }}>
        {cells}
      </View>
    )
  }
  // 打印头部
  _renderHeader() {
    const options = [
      { label: '开工', value: 'online' },
      { label: '收工', value: 'offline' }
    ]
    return (
      <View style={[commonStyles.itemCol_center, { backgroundColor: '#ffffff', paddingLeft: 30, paddingRight: 30, paddingTop: 44 }]}>
        <Image style={styles.avatar} source={require('../../img/head_200.png')} />
        <View>
          <Text style={styles.phone}>{this.state.userData.courierName}</Text>
        </View>
        <View>
          <Text style={styles.phone}>{this.state.userData.courierMobile}</Text>
        </View>
        <View style={[commonStyles.itemJustify_center, { width: 130, height: 75 }]}>
          <SwitchSelector
            options={options}
            initial={this.state.onlineState}
            fontSize={14}
            selectedColor='#ffffff'
            buttonColor='#f08300'
            textColor='#999999'
            backgroundColor='#efefef'
            onPress={value => this._changeWorkState(value)}>
          </SwitchSelector>
        </View>
        <View style={[commonStyles.itemRow, styles.subtitle]}>
          <View style={styles.line} />
          <Text style={styles.subfont}>今日战绩</Text>
          <View style={styles.line} />
        </View>
        <View style={[commonStyles.itemJustify_between, styles.grade]}>
          <View style={[commonStyles.itemCol_between]}>
            <View style={commonStyles.itemJustify_center}>
              <Text style={styles.font}>完成订单</Text></View>
            <View style={commonStyles.itemJustify_center}>
              <Text style={styles.font2}>{this.state.userData.orderCount}</Text></View>
          </View>
          <View style={[commonStyles.itemCol_between]}>
            <View style={commonStyles.itemJustify_center}>
              <Text style={styles.font}>服务里程</Text>
            </View>
            <View style={commonStyles.itemJustify_center}>
              <Text style={styles.font1}>{this.state.userData.totalDistance}</Text>
            </View>
          </View>
          <View style={[commonStyles.itemCol_between]}>
            <View style={commonStyles.itemJustify_center}>
              <Text style={styles.font}>完成金额</Text>
            </View>
            <View style={commonStyles.itemJustify_center}>
              <Text style={styles.font3}>{this.state.userData.courierSettleAmount}</Text>
            </View>
          </View>
        </View>
        <Flex style={{flex: 1}}>
          <Modal isVisible={this.state.isModalVisible}>
            <Flex direction='column' style={{backgroundColor: '#fff'}}>
              <Flex justify='center' style={commonStyles.info_title}>
                <Text style={commonStyles.title_txt}>收工</Text>
              </Flex>
              <Flex justify='center' style={{marginBottom: 35}}>
                <Text style={commonStyles.contain_txt}>将无法接收新的配送订单，确定收工？</Text>
              </Flex>
              <Flex justify='between' style={[{width: '100%'}, commonStyles.border_top]}>
                <TouchableOpacity style={{flex: 1}} onPress={() => this._cancel()}>
                  <Flex justify='center'>
                    <Text style={commonStyles.cancel_txt}>取消</Text>
                  </Flex>
                </TouchableOpacity>
                <View style={commonStyles.btn_line}></View>
                <TouchableOpacity style={{flex: 1}}  onPress={() =>this._offLine()}>
                  <Flex justify='center'>
                    <Text style={commonStyles.confirm_txt}>确定</Text>
                  </Flex>
                </TouchableOpacity>
              </Flex>
            </Flex>
          </Modal>
        </Flex>
      </View>
    )
  }

  render() {
    return (
      <View style={commonStyles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => this._onHeaderRefresh()}
              tintColor='gray'
            />
          }>
          {this._renderHeader()}
          {this._renderCells()}
          <View style={[commonStyles.itemJustify_center, {marginTop: 20, marginBottom: 40}]}>
            <Text style={{fontSize: 12, color: '#c0c0c0'}}>当前版本V1.2.0</Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    paddingTop: 10,
    paddingBottom: 5
  },
  phone: {
    fontSize: 17,
    color: color.importantFont,
    paddingTop: 10,
  },
  line: {
    flex: 1,
    height: screen.onePixel,
    backgroundColor: color.border,
  },
  subfont: {
    fontSize: 13,
    color: color.importantFont,
    marginLeft: 15,
    marginRight: 15
  },
  subtitle: {
    height: 25
  },
  grade: {
    height: 60
  },
  font: {
    fontSize: 13,
    color: '#999999'
  },
  font1: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#666666'
  },
  font2: {
    fontSize: 17,
    fontWeight: 'bold',
    color: color.primary
  },
  font3: {
    fontSize: 17,
    fontWeight: 'bold',
    color: color.red
  },
  icon1: {
    width: 8,
    height: 14
  },
  icon2: {
    width: 19,
    height: 17.5
  }
})


export default PersonalCenter
