import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator
} from 'react-native'
import {
  Flex
} from 'antd-mobile'
import DateTimePicker from 'react-native-modal-datetime-picker'
import commonStyles from '../../../commonStyle'
import api from '../../../api'
import Request from '../../../common/request'
import commonMethods from '../../../common/commonMethods'
import ListItem from './orderCell'

let page = '';
const size = 10;
let courierSettleTotalAmount = '';
export default class HistoryOrder extends Component {
  // 页面头部
  static navigationOptions = (navigation) => ({
    title: '历史订单'
  })
  constructor(props) {
    super(props)
    this.state = {
      fHeight: 0,
      listData: [],
      refresh: 0 , //0为默认状态，1为头部加载，2为底部加载， 3为已无更多数据，4为加载失败，5为暂无相关数据
      isDateTimePickerVisible: false, // 日历是否显示
      date: commonMethods._dateFormat(new Date()), // 当前日期， 默认为当天
      courierSettleTotalAmount: ''
    }
    this._onRefresh = this._onRefresh.bind(this);
    this._endReached = this._endReached.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._handleDatePicked = this._handleDatePicked.bind(this);
  }

  componentDidMount() {
    this._onRefresh();
  }
  // 日历的显隐控制
  _showDate(val) {
    this.setState({
      isDateTimePickerVisible: val
    })
  }
  // 选择时间
  _handleDatePicked(date) {
    this.setState({
      date: commonMethods._dateFormat(date),
      isDateTimePickerVisible: false
    })
    this._onRefresh();
  }
  // 获取订单列表数据
  async _requestData(isReload) {
    if (isReload) {
      // 下拉刷新
      page = 0;
    } else {
      page += 1;
    }
    const para = {
      searchDate: this.state.date,
      page: page,
      size: size
    }
    let dataList = [];
    let data = await Request.get(this.props.navigation, api.queryHistory, para);
    courierSettleTotalAmount = JSON.parse(data._bodyInit).courierSettleAmount.courierSettleTotalAmount;
    data = JSON.parse(data._bodyInit).results;
    dataList = data.map((item) => {
      // 地址拼接,不要省市，只要区、街道、门牌号
      const fromAddr = item.fromDistrictName + item.fromStreet + item.fromHouse;
      const destAddr = item.destDistrictName + item.destStreet + item.destHouse;
      return {
        expressOrderId: item.expressOrderId,
        finishTimeFormat: item.finishTimeFormat,
        courierSettleAmount: item.courierSettleAmount > 0 ? (item.courierSettleAmount).toFixed(1) : item.courierSettleAmount,
        fromAddr: fromAddr,
        destAddr: destAddr,
        destName: item.destName,
        deliveryDistancekm: item.deliveryDistancekm,
        distributionTimeFormat: item.distributionTimeFormat,
        orderCreateTime: item.orderCreateTime,
        acceptTime: item.acceptTime,
        fetchTime: item.fetchTime,
        finishTime: item.finishTime,
        fromBusinessName: item.fromBusinessName,
        orderWay: item.orderWay,
        orderWayName: item.orderWayName,
        courierFinishAbnormalState: item.courierFinishAbnormalState,
        thirdOrderViewId: item.thirdOrderViewId
      }
    })
    return dataList
  }
  // 下拉刷新
  async _onRefresh() {
    try {
      this.setState({ refresh: 1 })
      let dataList = await this._requestData(true);
      this.setState({
        courierSettleTotalAmount,
        listData: dataList,
        refresh: dataList.length ? 0 : 5
      })
    } catch (err) {
      this.setState({
        refresh: 4
      })
    }
  }
  // 上拉加载更多
  async _endReached() {
    try {
      this.setState({ refresh: 2 })
      let dataList = await this._requestData(false)
      this.setState({
        courierSettleTotalAmount,
        listData: [...this.state.listData, ...dataList],
        refresh : dataList.length < size ? 3 : 0
      })
    } catch (err) {
      this.setState({
        refresh: 4
      })
    }
  }
  // 上拉加载更多提示语
  _renderFooter() {
    let footer = null;
    let footerContainerStyle = [commonStyles.footerContainer];
    let footerTextStyle = [commonStyles.footerText];
    const texts = {
      footerRefreshingText: '玩命加载中 >.<',
      footerFailureText: '竟然失败了--!',
      footerNoMoreDataText: '-我是有底线的-',
      footerEmptyDataText: '',
    };
    let {footerRefreshingText, footerFailureText, footerNoMoreDataText, footerEmptyDataText} = texts;
    // 0为默认状态，1为头部加载，2为底部加载， 3为已无更多数据，4为加载失败，5为暂无相关数据
    switch (this.state.refresh) {
      case 0:
        footer = (<View style={footerContainerStyle}/>)
        break
      case 4:
        {
          footer = (
            <View style={footerContainerStyle}>
              <ActivityIndicator size="small" color="#888888"/>
              <Text
                style={[
                footerTextStyle, {
                  marginLeft: 7
                }
              ]}>{footerFailureText}</Text>
            </View>
          )
          break
        }
      case 5:
        {
          footer = (
            <TouchableOpacity
              style={footerContainerStyle}
              onPress={() => this._onRefresh}
            >
              <Text style={footerTextStyle}>{footerEmptyDataText}</Text>
            </TouchableOpacity>
          )
          break
        }
      case 2:
        {
          footer = (
            <View style={footerContainerStyle}>
              <ActivityIndicator size="small" color="#888888"/>
              <Text
                style={[
                footerTextStyle, {
                  marginLeft: 7
                }
              ]}>{footerRefreshingText}</Text>
            </View>
          )
          break
        }
      case 3:
        {
          footer = (
            <View style={footerContainerStyle}>
              <Text style={footerTextStyle}>{footerNoMoreDataText}</Text>
            </View>
          )
          break
        }
    }
    return footer
  }
  // 上拉加载更多提示语
  //此函数用于为给定的item生成一个不重复的key
  _keyExtractor = (item, index) => item.key;
  // 列表数据打印
  _renderItem(rowData, index) {
    return (
      <ListItem 
        data={rowData.item}
        navigation={this.props.navigation}
      />
    )
  }
  render() {
    const {isDateTimePickerVisible, date, courierSettleTotalAmount, fHeight} = this.state;
    const noData = 
      <Flex direction='column' justify='center' style={{height: fHeight}}>
        <Image
          source={require('../../../img/no_history.png')}
          style={commonStyles.no_order}
        />
      </Flex> 
    return (
      <View>
        <Flex justify='between' style={{height: 55, paddingHorizontal: 15, backgroundColor: '#fff'}}>
          <TouchableOpacity onPress={() => this._showDate(true)}>
            <Flex>
              <Text style={commonStyles.p4}>{date}</Text>
              <Image
                source={require('../../../img/day_triangle.png')}
                style={{width: 6, height: 6, resizeMode: 'contain', marginLeft: 10}}
              />
            </Flex>
          </TouchableOpacity>
          <Text style={commonStyles.font14}>共计：&nbsp;&yen;{courierSettleTotalAmount}</Text>
        </Flex>
        <FlatList 
          style={{width: '100%', marginBottom: 54}}
          data={this.state.listData}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          refreshing= {this.state.refresh == 1}
          onEndReachedThreshold= {0.2}
          onRefresh= {this._onRefresh}
          onEndReached= {this._endReached}
          onLayout={e => {
            let height = e.nativeEvent.layout.height;
            if (this.state.fHeight < height) {
              this.setState({fHeight: height})
            }
          }}
          ListEmptyComponent={noData}
          ListFooterComponent={this._renderFooter}
        >
        </FlatList>
        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={() => this._showDate(false)}
        />
      </View>
    )
  }
}
