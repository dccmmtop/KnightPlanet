import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ListView, Image, Dimensions, Linking } from 'react-native'
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'

import commonStyles from '../../commonStyle'
import api from '../../api'
import Request from '../../common/request'

let page = '';
export default class HistoryOrder extends Component {
  // 页面头部
  static navigationOptions = (navigation) => ({
    headerTitle: (
      <View style={commonStyles.itemJustify_center}>
        <Text style={[commonStyles.font6]}>骑士星球用户协议</Text>
      </View>
    ),
    headerTitleStyle: {
      alignSelf: 'center',
    },
    headerRight: <View />,
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
      data: [],
      refreshState: RefreshState.Idle,
    }
  }

  componentDidMount() {
  }
  render() {
    return (
      <View style={commonStyles.container}>
        <View style={commonStyles.listItem}>
          <Text>您在使用骑士星球产品或服务前，请认真阅读并充分理解相关法律条款、平台规则及用户隐私政策（可在“我的>法律条款”中查找并阅读）。当您点击同意，比比刚开始使用产品或服务，即表示您已经理解并同意该条款，该条款将构成对您具有法律约束力的法律文件。
          用户隐私政策主要包含以下内容：
          1.个人信息（手机号、姓名、身份证明、面部识别特征、车辆、位置等）
          2.设备权限（位置、通讯录、猫科风、相机等）的调用。</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contain: {

  }
})
