// 订单详情页
import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from "react-native";
import { Flex } from "antd-mobile";
import { MapView, Marker } from "react-native-amap3d";
import Modal from "react-native-modal";
import commonStyles from "../../commonStyle";
import Button from "../../widget/Button";
import MapLinking from "../../common/mapLinking";
import commonMethods from "../../common/commonMethods";

const mapheight = (Dimensions.get("window").width * 9) / 16; // 地图高度
let distance = "";
export default class OrderDetail extends Component {
  static navigationOptions = {
    title: "订单详情"
  };
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      isModalVisible1: false,
      isRefreshing: false,
      currentLat: global.lat,
      currentLng: global.lng,
      isOpen: false,
      Lists: {}
    };
    this._onRefresh = this._onRefresh.bind(this);
    this._changeList = this._changeList.bind(this);
  }
  // 刷新
  async _onRefresh() {
    this.setState({
      isRefreshing: true
    });
    setTimeout(() => {
      this.setState({
        isRefreshing: false,
        currentLat: global.lat,
        currentLng: global.lng
      });
    }, 1000);
  }
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });
  _toggleModal1 = () =>
    this.setState({ isModalVisible1: !this.state.isModalVisible1 });
  _comfirmPick(orderId) {
    this._toggleModal();
    commonMethods._comfirmPick(orderId, this.props.navigation, true);
  }
  _confirm(destLat, destLng) {
    // 计算到目的地的直线距离
    distance =
      commonMethods._conputeDistance(destLat, destLng, global.lat, global.lng) *
      1000;
    if (distance > 300) {
      this._toggleModal1();
    } else {
      this._toggleModal();
    }
  }
  _confirmSend(orderId, courierFinishAbnormalState) {
    if (distance > 300) {
      this._toggleModal1();
    } else {
      this._toggleModal();
    }
    commonMethods._confirmSend(
      orderId,
      courierFinishAbnormalState,
      this.props.navigation,
      true
    );
  }
  // 改变商品面板的显隐
  _changeList(orderId) {
    if (!this.state.isOpen) {
      this._getLists(orderId);
    }
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  // 获取商品列表
  async _getLists(orderId) {
    try {
      let Lists = await commonMethods._getProxydetail(orderId);
      this.setState({
        Lists
      });
    } catch (err) {
      console.log(err);
    }
  }
  // 改变商品面板的显隐
  _changeList(orderId) {
    if (!this.state.isOpen) {
      this._getLists(orderId);
    }
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  // 获取商品列表
  async _getLists(orderId) {
    try {
      let Lists = await commonMethods._getProxydetail(orderId);
      this.setState({
        Lists
      });
    } catch (err) {
      console.log(err);
    }
  }
  // 改变商品面板的显隐
  _changeList(orderId) {
    if (!this.state.isOpen) {
      this._getLists(orderId);
    }
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  // 获取商品列表
  async _getLists(orderId) {
    try {
      let Lists = await commonMethods._getProxydetail(orderId);
      this.setState({
        Lists
      });
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    const { isRefreshing, currentLat, currentLng, isOpen, Lists } = this.state;
    const { type, data } = this.props.navigation.state.params; // type: 待接单'waitreceive' 待取货'waitpick' 配送中'delivering'
    let latDelta = 0.1;
    let lngDelta = 0.1;
    // 到商家的距离
    let fromDistance = commonMethods._conputeDistance(
      parseFloat(this.state.currentLat),
      parseFloat(this.state.currentLng),
      this.props.navigation.state.params.data.fromLat,
      this.props.navigation.state.params.data.fromLng
    );
    fromDistance = `${fromDistance.toFixed(2)}km`;
    // 到用户的距离
    let destdistance = commonMethods._conputeDistance(
      parseFloat(this.state.currentLat),
      parseFloat(this.state.currentLng),
      this.props.navigation.state.params.data.destLat,
      this.props.navigation.state.params.data.destLng
    );
    destdistance = `${destdistance.toFixed(2)}km`;
    latDelta = Math.abs(
      Math.max(
        this.props.navigation.state.params.data.fromLat,
        parseFloat(this.state.currentLat),
        this.props.navigation.state.params.data.destLat
      ) -
        Math.min(
          this.props.navigation.state.params.data.fromLat,
          parseFloat(this.state.currentLat),
          this.props.navigation.state.params.data.destLat
        )
    );
    lngDelta = Math.abs(
      Math.max(
        this.props.navigation.state.params.data.fromLng,
        parseFloat(this.state.currentLng),
        this.props.navigation.state.params.data.destLng
      ) -
        Math.min(
          this.props.navigation.state.params.data.fromLng,
          parseFloat(this.state.currentLng),
          this.props.navigation.state.params.data.destLng
        )
    );
    lngDelta = Math.abs(
      Math.max(
        this.props.navigation.state.params.data.fromLng,
        parseFloat(this.state.currentLng),
        this.props.navigation.state.params.data.destLng
      ) -
        Math.min(
          this.props.navigation.state.params.data.fromLng,
          parseFloat(this.state.currentLng),
          this.props.navigation.state.params.data.destLng
        )
    );
    const lists = Lists.expressOrderProxyDetailShows
      ? Lists.expressOrderProxyDetailShows.map((item, index) => {
          return (
            <Flex
              justify="between"
              style={{ marginTop: index == 0 ? 0 : 15, paddingHorizontal: 10 }}
            >
              <Text style={commonStyles.font12} numberOfLines={1}>
                {item.resName}
              </Text>
              <Flex justify="between" style={{ width: 85, marginLeft: 10 }}>
                <Text style={commonStyles.font12}>x{item.quantity}</Text>
                <Text style={commonStyles.font12}>&yen;{item.price}</Text>
              </Flex>
            </Flex>
          );
        })
      : null;
    return (
      <ScrollView
        style={[commonStyles.wrapper]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        {type != "waitreceive" ? (
          <Flex justify="between" style={styles.time}>
            <Flex>
              <Text style={[commonStyles.p1, { marginRight: 10 }]}>
                {type == "waitpick" ? "取件倒计时" : "送达倒计时"}
              </Text>
              <Text
                style={[
                  data.restTime < 3 ? commonStyles.font17 : commonStyles.font18,
                  { fontWeight: "bold" }
                ]}
              >
                {data.restTime < 0 ? "已超过" : ""}
                {Math.abs(data.restTime)}分钟
              </Text>
            </Flex>
            <Text style={commonStyles.font10}>
              &yen;<Text style={{ marginLeft: 5 }}>
                {data.courierSettleAmount}
              </Text>
            </Text>
          </Flex>
        ) : data.orderWay == "applet-fast" ? (
          <Flex justify="center" style={styles.time}>
            <Text
              style={[commonStyles.p3, { fontWeight: "bold", marginRight: 10 }]}
            >
              {data.expectFetchTime}
            </Text>
            <Text style={commonStyles.p1}>前取件</Text>
          </Flex>
        ) : (
          <Flex justify="between" style={styles.time}>
            <Flex>
              <Text
                style={[
                  commonStyles.p3,
                  { fontWeight: "bold", marginRight: 10 }
                ]}
              >
                {data.expectDeliveryTime}
              </Text>
              <Text style={commonStyles.p1}>前送达</Text>
            </Flex>
            <Text style={commonStyles.font10}>
              &yen;<Text style={{ marginLeft: 5 }}>
                {data.courierSettleAmount}
              </Text>
            </Text>
          </Flex>
        )}
        {currentLat && currentLng ? (
          <View
            style={{ width: "100%", height: mapheight, overflow: "hidden" }}
          >
            <MapView
              style={{ width: "100%", height: mapheight }}
              showsZoomControls={false}
              showsLocationButton={false}
              showsTraffic
              zoomEnabled
              scrollEnabled
              showsZoomControls
              coordinate={{
                latitude: parseFloat(currentLat),
                longitude: parseFloat(currentLng)
              }}
              region={{
                latitude: parseFloat(currentLat),
                longitude: parseFloat(currentLng),
                latitudeDelta:
                  (latDelta > lngDelta ? latDelta : lngDelta) || 0.04,
                longitudeDelta:
                  (latDelta > lngDelta ? latDelta : lngDelta) || 0.04
              }}
            >
              <Marker
                active={type != "waitreceive" ? true : false}
                image="position_rider_map"
                coordinate={{
                  latitude: parseFloat(currentLat),
                  longitude: parseFloat(currentLng)
                }}
              >
                {type != "waitreceive" ? (
                  <Flex style={styles.info}>
                    <Flex justify="around" style={styles.info_box}>
                      <Text style={commonStyles.font15}>
                        {type == "waitpick" ? "距商家" : "即将送达"}
                      </Text>
                      <View
                        style={{
                          width: 1,
                          height: 22,
                          backgroundColor: "#e5e5e5"
                        }}
                      />
                      <Text style={commonStyles.font16}>
                        {type == "waitpick" ? fromDistance : destdistance}
                      </Text>
                    </Flex>
                  </Flex>
                ) : null}
              </Marker>
              {data.fromLat && data.fromLng ? (
                <Marker
                  image="position_qu"
                  coordinate={{
                    latitude: parseFloat(data.fromLat),
                    longitude: parseFloat(data.fromLng)
                  }}
                />
              ) : null}
              {data.destLat && data.destLng ? (
                <Marker
                  image="position_song"
                  coordinate={{
                    latitude: parseFloat(data.destLat),
                    longitude: parseFloat(data.destLng)
                  }}
                />
              ) : null}
            </MapView>
          </View>
        ) : null}
        <View style={commonStyles.container2}>
          <Flex direction="column" align="start">
            {data.orderWay == "applet-fast" ? (
              <Flex
                justify="between"
                style={[commonStyles.line3, { width: "100%" }]}
              >
                <Flex
                  justify="center"
                  style={[
                    commonStyles.num_circle,
                    data.thirdOrderViewId > 9
                      ? commonStyles.num_padding
                      : commonStyles.num_width
                  ]}
                >
                  <Text style={commonStyles.num_txt}>
                    {data.thirdOrderViewId}
                  </Text>
                </Flex>
                <Text style={commonStyles.font20}>一键下单</Text>
              </Flex>
            ) : null}
            <Flex
              justify="between"
              style={[
                commonStyles.padding15_top_bottom,
                { paddingRight: 15, width: "100%" }
              ]}
            >
              <Flex>
                <Image
                  source={require("../../img/ic_qu_40.png")}
                  style={[commonStyles.ic_word, commonStyles.marginRight15]}
                />
                <Text
                  numberOfLines={2}
                  style={[
                    commonStyles.font1,
                    { lineHeight: 20, marginRight: 15 }
                  ]}
                >
                  {data.fromBusinessName}
                </Text>
              </Flex>
              {data.orderWay == "jbg-proxy" ? (
                <Flex direction="column" style={commonStyles.proxy_box}>
                  <Text style={commonStyles.proxy_txt}>跑腿</Text>
                </Flex>
              ) : null}
            </Flex>
            <Flex>
              <Text
                numberOfLines={2}
                style={[
                  commonStyles.font11,
                  data.orderWay == "applet-fast"
                    ? null
                    : commonStyles.border_bottom,
                  { flex: 1, marginLeft: 35, paddingBottom: 15, lineHeight: 15 }
                ]}
              >
                {data.fromAddr}
              </Text>
            </Flex>
            {data.destAddr ? (
              <Flex
                style={[
                  commonStyles.padding15_top_bottom,
                  { paddingRight: 15 }
                ]}
              >
                <Image
                  source={require("../../img/ic_song_40.png")}
                  style={[commonStyles.ic_word, commonStyles.marginRight15]}
                />
                <Text
                  numberOfLines={2}
                  style={[
                    commonStyles.font1,
                    { lineHeight: 20, marginRight: 15 }
                  ]}
                >
                  {data.destAddr}
                </Text>
              </Flex>
            ) : null}
            {data.destName ? (
              <Flex>
                <Text
                  style={[
                    commonStyles.font6,
                    { flex: 1, marginLeft: 35, paddingBottom: 15 }
                  ]}
                >
                  {data.destName}
                </Text>
              </Flex>
            ) : null}
            {data.orderWay == "jbg-proxy" ? (
              <View style={commonStyles.order_line}>
                <Flex
                  direction="column"
                  align="start"
                  style={commonStyles.line3_contain}
                >
                  <TouchableOpacity
                    onPress={() => this._changeList(data.expressOrderId)}
                  >
                    <Flex
                      justify="between"
                      style={{ marginTop: 20, marginBottom: 20, width: "100%" }}
                    >
                      <Text
                        style={[commonStyles.font18, { fontWeight: "bold" }]}
                      >
                        商品
                      </Text>
                      <Flex justify="center" style={commonStyles.drop_btn}>
                        <Text style={commonStyles.font19}>
                          {isOpen ? "收起" : "展开"}
                        </Text>
                        <Image
                          source={
                            isOpen
                              ? require("../../img/arr-t-666.png")
                              : require("../../img/arr-d-666.png")
                          }
                          style={commonStyles.ic_arr}
                        />
                      </Flex>
                    </Flex>
                  </TouchableOpacity>
                  {isOpen ? (
                    <View style={commonStyles.order_line}>
                      <View
                        style={[
                          commonStyles.order_listbg,
                          { paddingVertical: 10 }
                        ]}
                      >
                        {lists}
                      </View>
                      <Flex justify="between" style={{ marginTop: 10 }}>
                        <Text style={commonStyles.font19}>餐盒费</Text>
                        <Text style={commonStyles.font19}>
                          &yen;{Lists.packingPrice}
                        </Text>
                      </Flex>
                      <Flex justify="between" style={{ marginTop: 10 }}>
                        <Text style={commonStyles.font19}>优惠</Text>
                        <Text style={commonStyles.font19}>
                          {Lists.discountPrice == 0 ? "" : "-"}&yen;{
                            Lists.discountPrice
                          }
                        </Text>
                      </Flex>
                      <Flex
                        justify="between"
                        style={[
                          commonStyles.order_line,
                          { marginVertical: 15 }
                        ]}
                      >
                        <Text style={commonStyles.font18}>
                          骑手需向商家支付
                        </Text>
                        <Text
                          style={[{ fontWeight: "bold" }, commonStyles.font18]}
                        >
                          &yen;{Lists.actualPrice}
                        </Text>
                      </Flex>
                    </View>
                  ) : null}
                </Flex>
              </View>
            ) : null}
            {data.orderWay == "applet-fast" && type == "waitreceive" ? (
              <Flex
                justify="center"
                style={[commonStyles.border_top, { width: "100%", height: 49 }]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => commonMethods._callVolid(data.fromMobile)}
                >
                  <Flex justify="center">
                    <Image
                      source={require("../../img/contact_shop.png")}
                      style={[
                        commonStyles.ic_contanct,
                        commonStyles.marginRight10
                      ]}
                    />
                    <Text>联系商家</Text>
                  </Flex>
                </TouchableOpacity>
              </Flex>
            ) : (
              <Flex
                justify="between"
                style={[commonStyles.border_top, { width: "100%", height: 49 }]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => commonMethods._callVolid(data.fromMobile)}
                >
                  <Flex justify="center">
                    <Image
                      source={require("../../img/contact_shop.png")}
                      style={[
                        commonStyles.ic_contanct,
                        commonStyles.marginRight10
                      ]}
                    />
                    <Text>联系商家</Text>
                  </Flex>
                </TouchableOpacity>
                <View style={styles.v_line} />
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => commonMethods._callVolid(data.destMobile)}
                >
                  <Flex justify="center">
                    <Image
                      source={require("../../img/contact_user.png")}
                      style={[
                        commonStyles.ic_contanct,
                        commonStyles.marginRight10
                      ]}
                    />
                    <Text>联系用户</Text>
                  </Flex>
                </TouchableOpacity>
              </Flex>
            )}
          </Flex>
        </View>
        <View
          style={[
            commonStyles.container2,
            { marginTop: 10, paddingBottom: 15 }
          ]}
        >
          <Flex justify="between" style={{ paddingTop: 15, paddingBottom: 10 }}>
            <Flex justify="center">
              <Text
                style={{
                  marginLeft: 3,
                  fontSize: 12,
                  color: data.orderCreateTime ? "#f08300" : "#999999"
                }}
              >
                下单
              </Text>
            </Flex>
            <Flex justify="center">
              <Text
                style={{
                  marginLeft: 28,
                  fontSize: 12,
                  color: data.acceptTime ? "#f08300" : "#999999"
                }}
              >
                接单
              </Text>
            </Flex>
            <Flex justify="center">
              <Text
                style={{
                  marginLeft: 23,
                  fontSize: 12,
                  color: data.fetchTime ? "#f08300" : "#999999"
                }}
              >
                实际到店
              </Text>
            </Flex>
            <Flex justify="center">
              <Text
                style={{
                  fontSize: 12,
                  color: data.finishTime ? "#f08300" : "#999999"
                }}
              >
                实际送达
              </Text>
            </Flex>
          </Flex>
          <Flex
            justify="between"
            style={{ paddingBottom: 10, marginRight: 30 }}
          >
            <Flex justify="center">
              <Image
                source={require("../../img/dot_color.png")}
                style={[styles.ic_dot, { marginLeft: 5 }]}
              />
            </Flex>
            <Flex justify="center">
              <View
                style={[
                  styles.h_line,
                  { backgroundColor: data.acceptTime ? "#f08300" : "#e5e5e5" }
                ]}
              />
              <Image
                source={
                  data.acceptTime
                    ? require("../../img/dot_color.png")
                    : require("../../img/dot.png")
                }
                style={styles.ic_dot}
              />
            </Flex>
            <Flex justify="center">
              <View
                style={[
                  styles.h_line,
                  { backgroundColor: data.fetchTime ? "#f08300" : "#e5e5e5" }
                ]}
              />
              <Image
                source={
                  data.fetchTime
                    ? require("../../img/dot_color.png")
                    : require("../../img/dot.png")
                }
                style={styles.ic_dot}
              />
            </Flex>
            <Flex justify="center">
              <View
                style={[
                  styles.h_line,
                  { backgroundColor: data.finishTime ? "#f08300" : "#e5e5e5" }
                ]}
              />
              <Image
                source={
                  data.finishTime
                    ? require("../../img/dot_color.png")
                    : require("../../img/dot.png")
                }
                style={styles.ic_dot}
              />
            </Flex>
          </Flex>
          <Flex
            justify="between"
            style={{ paddingBottom: 10, marginRight: 10 }}
          >
            <Flex justify="center">
              <Text style={commonStyles.font12}>{data.orderCreateTime}</Text>
            </Flex>
            <Flex justify="center">
              <Text style={[commonStyles.font12, { marginLeft: -25 }]}>
                {data.acceptTime}
              </Text>
            </Flex>
            <Flex justify="center">
              <Text style={[commonStyles.font12, { marginLeft: -25 }]}>
                {data.fetchTime}
              </Text>
            </Flex>
            <Flex justify="center">
              <Text style={[commonStyles.font12, { marginLeft: -25 }]}>
                {data.finishTime}
              </Text>
            </Flex>
          </Flex>
        </View>
        <View>
          <Flex style={{ height: 44, marginLeft: 15 }}>
            <Text style={commonStyles.font13}>订单信息</Text>
          </Flex>
          <View
            style={{ backgroundColor: "#fff", paddingLeft: 15, paddingTop: 15 }}
          >
            <Flex style={{ marginBottom: 15 }}>
              <Text style={commonStyles.font13}>业务类别</Text>
              <Text style={[commonStyles.font14, { marginLeft: 15 }]}>
                {data.orderWayName}
              </Text>
            </Flex>
            {data.orderWay == "applet-fast" ? (
              <Flex style={{ marginBottom: 15 }}>
                <Text style={commonStyles.font13}>一键下单单号</Text>
                <Text style={[commonStyles.font14, { marginLeft: 15 }]}>
                  {data.thirdOrderViewId}
                </Text>
              </Flex>
            ) : null}
            <Flex style={{ marginBottom: 15 }}>
              <Text style={commonStyles.font13}>订单号码</Text>
              <Text style={[commonStyles.font14, { marginLeft: 15 }]}>
                {data.expressOrderId}
              </Text>
            </Flex>
          </View>
        </View>
        <Flex style={[commonStyles.container2, { marginTop: 15, height: 75 }]}>
          {type == "waitreceive" ? (
            <Button
              disabled={false}
              style={[commonStyles.primaryBtn1, { flex: 1 }]}
              titleStyle={commonStyles.pbton}
              title="接单"
              onPress={() =>
                commonMethods._receiveOrder(
                  data.expressOrderId,
                  this.props.navigation,
                  1
                )
              }
              opacity={1}
            />
          ) : type == "waitpick" ? (
            <Flex>
              <Button
                disabled={false}
                style={[commonStyles.primaryBtn3, { flex: 1, marginRight: 10 }]}
                titleStyle={commonStyles.font3}
                title="导航去商家"
                onPress={() =>
                  MapLinking.planRoute(
                    null,
                    {
                      lat: data.fromLat,
                      lng: data.fromLng,
                      type: "gcj02",
                      title: data.fromAddr
                    },
                    "ride"
                  )
                }
                opacity={1}
              />
              <Button
                disabled={false}
                style={[commonStyles.primaryBtn1, { flex: 1 }]}
                titleStyle={commonStyles.pbton}
                title="确认取件"
                onPress={this._toggleModal}
                opacity={1}
              />
            </Flex>
          ) : (
            <Flex>
              <Button
                disabled={false}
                style={[commonStyles.primaryBtn3, { flex: 1, marginRight: 10 }]}
                titleStyle={commonStyles.font3}
                title="导航去用户"
                onPress={() =>
                  MapLinking.planRoute(
                    null,
                    {
                      lat: data.destLat,
                      lng: data.destLng,
                      type: "gcj02",
                      title: data.destAddr
                    },
                    "ride"
                  )
                }
                opacity={1}
              />
              <Button
                disabled={false}
                style={[commonStyles.primaryBtn1, { flex: 1 }]}
                titleStyle={commonStyles.pbton}
                title="确认送达"
                onPress={() => this._confirm(data.destLat, data.destLng)}
                opacity={1}
              />
            </Flex>
          )}
        </Flex>
        <Flex style={{ flex: 1 }}>
          {type == "waitpick" ? (
            <Modal isVisible={this.state.isModalVisible}>
              <Flex direction="column" style={{ backgroundColor: "#fff" }}>
                <Flex justify="center" style={commonStyles.info_title}>
                  <Text style={commonStyles.title_txt}>取件确认</Text>
                </Flex>
                <Flex justify="center" style={{ marginBottom: 35 }}>
                  <Text style={commonStyles.contain_txt}>
                    确定<Text
                      style={[commonStyles.font7, { marginHorizontal: 5 }]}
                    >
                      {data.fromBusinessName}
                    </Text>的商品已取件？
                  </Text>
                </Flex>
                <Flex
                  justify="between"
                  style={[{ width: "100%" }, commonStyles.border_top]}
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={this._toggleModal}
                  >
                    <Flex justify="center">
                      <Text style={commonStyles.cancel_txt}>取消</Text>
                    </Flex>
                  </TouchableOpacity>
                  <View style={commonStyles.btn_line} />
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => this._comfirmPick(data.expressOrderId)}
                  >
                    <Flex justify="center">
                      <Text style={commonStyles.confirm_txt}>确定</Text>
                    </Flex>
                  </TouchableOpacity>
                </Flex>
              </Flex>
            </Modal>
          ) : type == "delivering" ? (
            <Modal isVisible={this.state.isModalVisible}>
              <Flex direction="column" style={{ backgroundColor: "#fff" }}>
                <Flex justify="center" style={commonStyles.info_title}>
                  <Text style={commonStyles.title_txt}>配送确认</Text>
                </Flex>
                <Flex justify="center" style={{ marginBottom: 35 }}>
                  <Text style={commonStyles.contain_txt}>
                    确定<Text
                      style={[commonStyles.font7, { marginHorizontal: 5 }]}
                    >
                      {data.destName}
                    </Text>的商品已送达？
                  </Text>
                </Flex>
                <Flex
                  justify="between"
                  style={[{ width: "100%" }, commonStyles.border_top]}
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={this._toggleModal}
                  >
                    <Flex justify="center">
                      <Text style={commonStyles.cancel_txt}>取消</Text>
                    </Flex>
                  </TouchableOpacity>
                  <View style={commonStyles.btn_line} />
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() =>
                      this._confirmSend(data.expressOrderId, false)
                    }
                  >
                    <Flex justify="center">
                      <Text style={commonStyles.confirm_txt}>确定</Text>
                    </Flex>
                  </TouchableOpacity>
                </Flex>
              </Flex>
            </Modal>
          ) : null}
          <Modal isVisible={this.state.isModalVisible1}>
            <Flex direction="column" style={{ backgroundColor: "#fff" }}>
              <Flex
                justify="center"
                style={{ marginTop: 20, marginBottom: 35 }}
              >
                <Image
                  source={require("../../img/ic_remind.png")}
                  style={{ width: 60, height: 60, resizeMode: "contain" }}
                />
              </Flex>
              <Flex
                direction="column"
                justify="center"
                style={{ marginBottom: 35 }}
              >
                <Flex justify="center">
                  <Text style={commonStyles.contain_txt1}>
                    您距离配送地址还有一段距离哦~
                  </Text>
                </Flex>
                <Flex justify="center">
                  <Text style={commonStyles.contain_txt1}>是否确认送达？</Text>
                </Flex>
              </Flex>
              <Flex
                justify="between"
                style={[{ width: "100%" }, commonStyles.border_top]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => this._confirmSend(data.expressOrderId, true)}
                >
                  <Flex justify="center">
                    <Text style={commonStyles.confirm_txt}>确认送达</Text>
                  </Flex>
                </TouchableOpacity>
                <View style={commonStyles.btn_line} />
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={this._toggleModal1}
                >
                  <Flex justify="center">
                    <Text style={commonStyles.cancel_txt}>取消</Text>
                  </Flex>
                </TouchableOpacity>
              </Flex>
            </Flex>
          </Modal>
        </Flex>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  time: {
    height: 55,
    width: "100%",
    paddingHorizontal: 15,
    backgroundColor: "#fff"
  },
  v_line: {
    width: 1,
    height: 25,
    backgroundColor: "#e5e5e5"
  },
  h_line: {
    width: 60,
    height: 1,
    marginHorizontal: 10
  },
  ic_dot: {
    width: 18,
    height: 18,
    resizeMode: "contain"
  },
  info: {
    marginBottom: 10
  },
  info_box: {
    width: 117,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 20
  },
  ic_triangle: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    marginLeft: -4.5,
    width: 9,
    height: 8,
    resizeMode: "contain"
  }
});
