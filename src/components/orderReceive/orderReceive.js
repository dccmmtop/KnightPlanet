import React, { Component } from "react";
import {
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
  AppState,
  StatusBar,
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { Flex, Toast } from "antd-mobile";
import { changeTab } from "../../actions";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import ScrollableTabView from "react-native-scrollable-tab-view";
import SplashScreen from "react-native-splash-screen";
import LabidcLocation from "react-native-labidc-location";
import color from "../../widget/color";
import api from "../../api";
import Request from "../../common/request";
import commonStyles from "../../commonStyle";
import Button from "../../widget/Button";

import TabBar from "./TabBar";
import WaitReceive from "./waitReceive/waitReceive";
import WaitInput from "./waitInput/waitInput";
import WaitPickup from "./waitPickup/waitPickup";
import Delivering from "./delivering/delivering";

class OrderReceive extends Component {
  // 页面头部
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    global.nav = props.navigation;
    this.state = {
      selectedTab: "waitReceive",
      tabNames: ["待接单", "待录单", "待取件", "配送中"],
      tabNum: [0, 0, 0, 0],
      nowPage: null,
      onlineState: true // 是否开工
    };
    this.NativeToMsg = this.NativeToMsg.bind(this);
    this.NativeToLocation = this.NativeToLocation.bind(this);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    this._online = this._online.bind(this);
    if (Platform.OS === "android") {
      /**
       * 监听原生发过来的消息
       */
      DeviceEventEmitter.addListener("XingGeMsg", this.NativeToMsg);
    }
  }
  componentWillUnmount() {
    clearInterval(global.timeID);
  }
  componentDidMount() {
    LabidcLocation.start(5, (statusCode, statusJson) => {
      console.warn(statusCode);
      console.warn(typeof statusCode);
      console.warn(statusJson);
    });
    if (!global.lat || !global.lng) {
      Toast.loading("正在获取您的位置...", 500);
    }
    DeviceEventEmitter.addListener("orderReceive", () => {
      this._getNums();
    });
    // 程序回到前台重新刷新页面
    AppState.addEventListener("change", this._handleAppStateChange);
    this._getNums();
    if (Platform.OS == "android") {
      this._locationServer(global.user.Authorization); // 启动定位服务
      SplashScreen.hide(); // 隐藏启动页
      DeviceEventEmitter.addListener("location", this.NativeToLocation); // 监听用户位置的变化并返回经纬度
    } else if (Platform.OS === "ios") {
      this.getLocation();
    }
    // 十秒传递一次快递员的位置信息给后台更新数据库，以便实时分单
    global.timeID = setInterval(() => {
      if (this.state.lat && this.state.lon) {
        this._sendLiveLocation();
      }
    }, 10000);
  }
  // 获取地理位置
  getLocation() {
    const labidcLocationEmitter = new NativeEventEmitter(LabidcLocation);
    const subscription = labidcLocationEmitter.addListener(
      "location",
      reminder => {
        if (reminder) {
          Toast.hide();
          let location = reminder.location.split(",");
          this.state.lat = location[0];
          this.state.lon = location[1];
          global.lat = location[0];
          global.lng = location[1];
        }
        this._sendLiveLocation();
      }
    );
  }
  // android调用原生模块上传位置
  _locationServer(authorization) {
    let KpLocationService = NativeModules.KpLocationService;
    KpLocationService.startService(authorization);
  }
  // 上传快递员位置信息
  _sendLiveLocation() {
    const para = {
      lng: this.state.lon.toString(),
      lat: this.state.lat.toString()
    };
    Request.post(this.props.navigation, api.liveLocation, JSON.stringify(para))
      .then(res => {
        if (res.ok) {
        } else {
          console.log(
            "快递员位置传递失败：",
            JSON.parse(res._bodyInit).message
          );
        }
      })
      .catch(err => {
        console.log("快递员位置传递失败：", err);
      });
  }
  /**
   * 原生Activity 回到激活状态调用
   * @param event
   * @constructor
   */
  NativeToMsg(event) {
    if (event) {
      if (event == "msgIsClicked") {
        // 信鸽推动消息被点击
        // 清空路由栈并跳转到新订单页面
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: "OrderReceive" })]
        });
        this.props.navigation.dispatch(resetAction);
      } else if (event == "msgIsShow") {
        // 接收到消息刷新数据
        this._getNums();
      }
    }
  }
  /**
   * 原生Activity 监听用户的位置
   * @param event
   * @constructor
   */
  NativeToLocation(event, json) {
    if (event) {
      Toast.hide();
      let location = event.split(",");
      this.state.lat = location[0];
      this.state.lon = location[1];
      global.lat = location[0];
      global.lng = location[1];
    }
  }
  _handleAppStateChange(currentAppState) {
    if (currentAppState === "active") {
      this.setState({
        nowPage: 0
      });
    }
  }
  // 获取订单数量
  async _getNums() {
    this._requestData();
    let data = await Request.get(this.props.navigation, api.queryNums);
    data = JSON.parse(data._bodyInit);
    let tabNum = [];
    if (data) {
      if (data.result) {
        tabNum.push(data.result.waitAccept);
        tabNum.push(data.result.waitWrite);
        tabNum.push(data.result.waitFetch);
        tabNum.push(data.result.sending);
        this.setState({
          tabNum
        });
      } else {
        Toast.info(data.message, 1.5);
      }
    }
  }
  // 获取用户数据
  async _requestData() {
    let data = await Request.get(this.props.navigation, api.userDate);
    data = JSON.parse(data._bodyInit);
    if (data) {
      if (data.courierMobile != "") {
        this.setState({
          onlineState: data.onlineState
        });
      } else {
        Toast.info(data.message, 1.5);
      }
    }
  }
  // 马上开工
  _online() {
    Request.put(this.props.navigation, api.onLine)
      .then(res => {
        if (res.ok) {
          // 接口请求成功
          Toast.info("开工成功，愉快的赚钱吧^^", 1.5);
          this._getNums();
        } else {
          Toast.info(JSON.parse(res._bodyInit).message, 1.5);
        }
      })
      .catch(err => {
        Toast.info(JSON.parse(err._bodyInit).message, 1.5);
      });
  }
  render() {
    const { tabNames, tabNum, nowPage, onlineState } = this.state;
    return (
      <View>
        <StatusBar
          barStyle="dark-content"
          style={{ backgroundColor: "#fff" }}
        />
        <View
          style={[
            commonStyles.wrapper,
            Platform.OS === "ios" ? { paddingTop: 20 } : ""
          ]}
        >
          <Flex justify="center" style={commonStyles.myTitle}>
            <TouchableOpacity
              style={styles.logo_box}
              onPress={() => this.props.navigation.navigate("PersonalCenter")}
            >
              <Image
                source={require("../../img/head_60.png")}
                style={styles.logo}
              />
            </TouchableOpacity>
            <Text style={commonStyles.font6}>订单</Text>
          </Flex>
          <View style={{ width: "100%", height: "100%" }}>
            {onlineState ? (
              <ScrollableTabView
                onChangeTab={obj => this.setState({ nowPage: obj.i })}
                renderTabBar={() => (
                  <TabBar tabNames={tabNames} tabNum={tabNum} activeTab={4} />
                )}
                tabBarPosition="top"
              >
                <WaitReceive
                  navigation={this.props.navigation}
                  index={0}
                  nowPage={nowPage}
                  num={tabNum[0]}
                />
                <WaitInput
                  navigation={this.props.navigation}
                  index={1}
                  nowPage={nowPage}
                  num={tabNum[1]}
                />
                <WaitPickup
                  navigation={this.props.navigation}
                  index={2}
                  nowPage={nowPage}
                  num={tabNum[2]}
                />
                <Delivering
                  navigation={this.props.navigation}
                  index={3}
                  nowPage={nowPage}
                  num={tabNum[3]}
                />
              </ScrollableTabView>
            ) : (
              <Flex
                direction="column"
                justify="end"
                style={{ flex: 1, marginBottom: 74 }}
              >
                <Image
                  source={require("../../img/pic_open.png")}
                  style={{
                    width: 117.5,
                    height: 103,
                    resizeMode: "contain",
                    marginBottom: 35
                  }}
                />
                <Text style={commonStyles.font1}>
                  休息期间，仿佛错过一个亿~
                </Text>
                <Text style={{ fontSize: 14, color: "#999999", marginTop: 10 }}>
                  骑士星球，每月多赚500元~
                </Text>
                <Flex justify="center">
                  <Button
                    disabled={false}
                    style={[
                      commonStyles.primaryBtn1,
                      { flex: 1, marginHorizontal: 47.5, marginTop: 35 }
                    ]}
                    titleStyle={commonStyles.pbton}
                    title="马上开工"
                    onPress={this._online}
                    opacity={1}
                  />
                </Flex>
              </Flex>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logo_box: {
    position: "absolute",
    left: 15,
    top: 7
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: "contain"
  },
  container: {
    flex: 1,
    backgroundColor: color.paper
  }
});

export default connect(
  state => state,
  { changeTab }
)(OrderReceive);
