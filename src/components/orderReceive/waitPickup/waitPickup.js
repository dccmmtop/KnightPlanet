// 待取货订单
import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ActivityIndicator,
  DeviceEventEmitter
} from "react-native";
import { Flex } from "antd-mobile";
import { getThunkOrderList } from "../../../actions";
import { connect } from "react-redux";
import commonStyles from '../../../commonStyle'
import api from '../../../api'
import Request from '../../../common/request'
import PickCell from './pickupCell'

const { width } = Dimensions.get("window");
let page = 0;
const size = 10;
class WaitReceive extends Component {
  static navigationOptions = navigation => ({
    header: null
  });
  constructor(props) {
    super(props);
    this.state = {
      fHeight: 0, // FlastList高度
      listData: [],
      refresh: 0 //0为默认状态，1为头部加载，2为底部加载， 3为已无更多数据，4为加载失败，5为暂无相关数据
    };
    this._onRefresh = this._onRefresh.bind(this);
    this._endReached = this._endReached.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._renderItem = this._renderItem.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.index == newProps.nowPage) {
      this._onRefresh();
    }
  }
  componentDidMount() {
    DeviceEventEmitter.addListener("waitPickup", () => {
      this._onRefresh();
    });
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
      status: "wait_fetch",
      page: page,
      size: size
    };
    let dataList = [];
    // await this.props.getThunkOrderList(
    //   this.props.navigation,
    //   api.searchOrders,
    //   para
    // );
    // this.props.orderData.results
    let data = await Request.get(this.props.navigation, api.searchOrders, para);
    data = JSON.parse(data._bodyInit).results;
    dataList = data.map(item => {
      // 取货倒计时计算
      const fetchTime = new Date(item.expectFetchTime);
      const nowTime = new Date();
      let restTime = (parseInt(fetchTime - nowTime) / 1000 / 60).toFixed(0); //计算结果为分钟
      // 地址拼接,不要省市，只要区、街道、门牌号
      const fromAddr = item.fromDistrictName + item.fromStreet + item.fromHouse;
      const destAddr = item.destDistrictName + item.destStreet + item.destHouse;
      return {
        expressOrderId: item.expressOrderId,
        restTime: restTime,
        courierSettleAmount:
          item.courierSettleAmount > 0
            ? item.courierSettleAmount.toFixed(1)
            : item.courierSettleAmount,
        fromAddr: fromAddr,
        fromName: item.fromName,
        fromMobile: item.fromMobile,
        fromLat: item.fromLat,
        fromLng: item.fromLng,
        fromBusinessName: item.fromBusinessName,
        destLat: item.destLat,
        destLng: item.destLng,
        destAddr: destAddr,
        destMobile: item.destMobile,
        destName: item.destName,
        orderCreateTime: item.orderCreateTime,
        acceptTime: item.acceptTime,
        fetchTime: item.fetchTime,
        finishTime: item.finishTime,
        thirdOrderViewId: item.thirdOrderViewId,
        orderFastState: item.orderFastState,
        courierFinishAbnormalState: item.courierFinishAbnormalState,
        orderWay: item.orderWay,
        orderWayName: item.orderWayName
      }
    })
    return dataList
  }
  // 下拉刷新
  async _onRefresh() {
    try {
      this.setState({ refresh: 1 });
      let dataList = await this._requestData(true);
      this.setState({
        listData: dataList,
        refresh: dataList.length ? 0 : 5
      });
    } catch (err) {
      this.setState({
        refresh: 4
      });
    }
  }
  // 上拉加载更多
  async _endReached() {
    try {
      this.setState({ refresh: 2 });
      let dataList = await this._requestData(false);
      this.setState({
        listData: [...this.state.listData, ...dataList],
        refresh: dataList.length < size ? 3 : 0
      });
    } catch (err) {
      this.setState({
        refresh: 4
      });
    }
  }
  // 上拉加载更多提示语
  _renderFooter() {
    let footer = null;
    let footerContainerStyle = [commonStyles.footerContainer];
    let footerTextStyle = [commonStyles.footerText];
    const texts = {
      footerRefreshingText: "玩命加载中 >.<",
      footerFailureText: "竟然失败了--!",
      footerNoMoreDataText: "-我是有底线的-",
      footerEmptyDataText: ""
    };
    let {
      footerRefreshingText,
      footerFailureText,
      footerNoMoreDataText,
      footerEmptyDataText
    } = texts;
    // 0为默认状态，1为头部加载，2为底部加载， 3为已无更多数据，4为加载失败，5为暂无相关数据
    switch (this.state.refresh) {
      case 0:
        footer = <View style={footerContainerStyle} />;
        break;
      case 4: {
        footer = (
          <View style={footerContainerStyle}>
            <ActivityIndicator size="small" color="#888888" />
            <Text
              style={[
                footerTextStyle,
                {
                  marginLeft: 7
                }
              ]}
            >
              {footerFailureText}
            </Text>
          </View>
        );
        break;
      }
      case 5: {
        footer = (
          <TouchableOpacity
            style={footerContainerStyle}
            onPress={() => this._onRefresh}
          >
            <Text style={footerTextStyle}>{footerEmptyDataText}</Text>
          </TouchableOpacity>
        );
        break;
      }
      case 2: {
        footer = (
          <View style={footerContainerStyle}>
            <ActivityIndicator size="small" color="#888888" />
            <Text
              style={[
                footerTextStyle,
                {
                  marginLeft: 7
                }
              ]}
            >
              {footerRefreshingText}
            </Text>
          </View>
        );
        break;
      }
      case 3: {
        footer = (
          <View style={footerContainerStyle}>
            <Text style={footerTextStyle}>{footerNoMoreDataText}</Text>
          </View>
        );
        break;
      }
    }
    return footer;
  }
  // 上拉加载更多提示语
  //此函数用于为给定的item生成一个不重复的key
  _keyExtractor = (item, index) => item.key;
  // 列表数据打印
  _renderItem(rowData, index) {
    return <PickCell data={rowData.item} navigation={this.props.navigation} />;
  }
  render() {
    const noData = (
      <Flex
        direction="column"
        justify="center"
        style={{ height: this.state.fHeight }}
      >
        <Image
          source={require("../../../img/no_order.png")}
          style={commonStyles.no_order}
        />
      </Flex>
    );
    return (
      <FlatList
        style={{ width: "100%", marginBottom: 54 }}
        data={this.state.listData}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        refreshing={this.state.refresh == 1}
        onEndReachedThreshold={0.2}
        onRefresh={this._onRefresh}
        onEndReached={this._endReached}
        onLayout={e => {
          let height = e.nativeEvent.layout.height;
          if (this.state.fHeight < height) {
            this.setState({ fHeight: height });
          }
        }}
        ListEmptyComponent={noData}
        ListFooterComponent={this._renderFooter}
      />
    );
  }
}

export default connect(
  state => state,
  {
    getThunkOrderList
  }
)(WaitReceive);
