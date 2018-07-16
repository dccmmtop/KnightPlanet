// 订单详情页
import React, { Component } from 'react';
import { 
  View, 
  Text,
  Image, 
  Platform, 
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from 'react-native';
import {
  Flex
}from 'antd-mobile';
import { 
  MapView,
  Marker
} from 'react-native-amap3d';
import commonStyles from '../../../commonStyle';

const mapheight = Dimensions.get('window').width * 9/16; // 地图高度
let gcore = {}; // 存储当前经纬度
export default class HistoryDetail extends Component{
  static navigationOptions = {
    title: '订单详情'
  };
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      isOpen: false,
      Lists: {}
    }
    this._onRefresh = this._onRefresh.bind(this);
    this._changeList = this._changeList.bind(this);
  }
  // 刷新
  async _onRefresh() {
    this.setState({
      isRefreshing: true,
    });
    setTimeout(() => {
      this.setState({
        isRefreshing: false,
        currentLat: gcore.latitude,
        currentLng: gcore.longitude
      });
    }, 1500)
    // try{
    //   await this._getData();
    //   this.setState({isRefreshing: false})
    // } catch(err) {
    //   Toast.info(err, 1.5)
    // }
  }
   // 改变商品面板的显隐
   _changeList(orderId) {
    if(!this.state.isOpen) {
      this._getLists(orderId)
    }
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
  // 获取商品列表
  async _getLists(orderId) {
    try {
      let Lists = await commonMethods._getProxydetail(orderId);
      this.setState({
        Lists
      })
    } catch(err) {
      console.log(err)
    }
  }
  render() {
    const {isRefreshing, currentLat, currentLng, isOpen, Lists} = this.state;
    const {data} = this.props.navigation.state.params;
    const lists = Lists.expressOrderProxyDetailShows ? Lists.expressOrderProxyDetailShows.map((item, index) => {
      return(
        <Flex justify='between' style={{marginTop: index == 0 ? 0 : 15, paddingHorizontal: 10,}}>
          <Text style={commonStyles.font12} numberOfLines={1}>{item.resName}</Text>
          <Flex justify='between' style={{width: 85, marginLeft: 10}}>
            <Text style={commonStyles.font12}>x{item.quantity}</Text>
            <Text style={commonStyles.font12}>&yen;{item.price}</Text>
          </Flex>    
        </Flex>
      )
    }) : null
    return(
      <ScrollView 
        style={[commonStyles.wrapper]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={this._onRefresh}
          />
        }>
        <View style={[commonStyles.container2, {marginTop: 10}]}>
          <Flex direction='column' align='start'>
            {data.orderWay == 'applet-fast' ? 
              <Flex justify='between' style={[commonStyles.line3, {width: '100%'}]}>
                <Flex justify='center' style={[commonStyles.num_circle, data.thirdOrderViewId > 9 ? commonStyles.num_padding : commonStyles.num_width]}>
                  <Text style={commonStyles.num_txt}>{data.thirdOrderViewId}</Text>
                </Flex>
                <Text style={commonStyles.font20}>一键下单</Text>
              </Flex> : null
            }
            <Flex style={[commonStyles.padding15_top_bottom, {paddingRight: 15, width: '100%'}]}>
              <Flex>
                <Image
                  source={require('../../../img/ic_qu_40.png')}
                  style={[commonStyles.ic_word, commonStyles.marginRight15]}
                />
                <Text numberOfLines={2} style={[commonStyles.font1, {lineHeight: 20, marginRight: 15}]}>{data.fromBusinessName}</Text>
              </Flex>
              {data.orderWay == 'jbg-proxy' ? 
                <Flex direction='column' style={commonStyles.proxy_box}>
                  <Text style={commonStyles.proxy_txt}>跑腿</Text>
                </Flex> : null
              }
            </Flex>
            <Flex>
              <Text numberOfLines={2} style={[commonStyles.font11, commonStyles.border_bottom, {flex: 1, marginLeft: 35, paddingBottom: 15, lineHeight: 15}]}>{data.fromAddr}</Text>
            </Flex>
            <Flex style={[commonStyles.padding15_top_bottom, {paddingRight: 15}]}>
              <Image
                source={require('../../../img/ic_song_40.png')}
                style={[commonStyles.ic_word, commonStyles.marginRight15]}
              />
              <Text numberOfLines={2} style={[commonStyles.font1, {lineHeight: 20, marginRight: 15}]}>{data.destAddr}</Text>
            </Flex>
            <Flex>
              <Text style={[commonStyles.font6, {flex: 1, marginLeft: 35, paddingBottom: 15}]}>{data.destName}</Text>
            </Flex>
            {data.orderWay == 'jbg-proxy' ? 
              <View style={commonStyles.order_line}>
                <Flex direction='column' align='start' style={commonStyles.line3_contain}>
                  <TouchableOpacity onPress={() => this._changeList(data.expressOrderId)}>
                    <Flex justify='between' style={{marginTop: 20, marginBottom: 20, width: '100%'}}>
                      <Text style={[commonStyles.font18, {fontWeight: 'bold'}]}>商品</Text>
                        <Flex justify='center' style={commonStyles.drop_btn}>
                          <Text style={commonStyles.font19}>{isOpen ? '收起' : '展开'}</Text>
                          <Image
                            source={isOpen ? require('../../../img/arr-t-666.png') : require('../../../img/arr-d-666.png')}
                            style={commonStyles.ic_arr}
                          />
                        </Flex>
                    </Flex>
                  </TouchableOpacity>
                  {isOpen ? 
                  <View style={commonStyles.order_line} >
                    <View style={[commonStyles.order_listbg, {paddingVertical: 10}]}>
                      {lists}
                    </View>
                    <Flex justify='between' style={{marginTop: 10}}>
                      <Text style={commonStyles.font19}>餐盒费</Text>
                      <Text style={commonStyles.font19}>&yen;{Lists.packingPrice}</Text>
                    </Flex>
                    <Flex justify='between' style={{marginTop: 10}}>
                      <Text style={commonStyles.font19}>优惠</Text>
                      <Text style={commonStyles.font19}>{Lists.discountPrice == 0 ? '' : '-'}&yen;{Lists.discountPrice}</Text>
                    </Flex>
                    <Flex justify='between' style={[commonStyles.order_line, {marginVertical: 15}]}>
                      <Text style={commonStyles.font18}>骑手需向商家支付</Text>
                      <Text style={[{fontWeight: 'bold'}, commonStyles.font18]}>&yen;{Lists.actualPrice}</Text>
                    </Flex>
                  </View> : null
                }
              </Flex>
            </View> : null
            }
          </Flex>
          <Flex justify='around' style={[commonStyles.border_top, {height: 44}]}>
            <Text style={commonStyles.font11}>用时{data.distributionTimeFormat}分钟</Text>
            <View style={styles.v_line}></View>
            <Text style={commonStyles.font11}>距离{data.deliveryDistancekm}km</Text>
            <View style={styles.v_line}></View>
            <Text style={commonStyles.font10}>&yen;&nbsp;{data.courierSettleAmount}</Text>
          </Flex>
        </View>
        <View style={[commonStyles.container2, {marginTop: 10}]}>
          <Flex justify='between' style={{paddingTop: 15, paddingBottom: 10}}>
            <Flex justify='center'>
              <Text style={{marginLeft: 3, fontSize: 12, color: data.orderCreateTime ? '#f08300' : '#999999'}}>下单</Text>
            </Flex>
            <Flex justify='center'>
              <Text style={{marginLeft: 28, fontSize: 12, color: data.acceptTime ? '#f08300' : '#999999'}}>接单</Text>
            </Flex>
            <Flex justify='center'>
              <Text style={{marginLeft: 23, fontSize: 12, color: data.fetchTime ? '#f08300' : '#999999'}}>实际到店</Text>
            </Flex>
            <Flex justify='center'>
              <Text style={{fontSize: 12, color: data.finishTime ? (data.courierFinishAbnormalState ? '#ff3f3e' : '#f08300') : '#999999'}}>{data.courierFinishAbnormalState ? '异常送达' : '实际送达'}</Text>
            </Flex>
          </Flex>
          <Flex justify='between' style={{ paddingBottom: 10, marginRight: 30}}>
            <Flex justify='center'>
              <Image
                source={require('../../../img/dot_color.png')}
                style={[styles.ic_dot, {marginLeft: 5}]}
              />
            </Flex>
            <Flex justify='center'>
              <View style={[styles.h_line, {backgroundColor: data.acceptTime ? '#f08300' : '#e5e5e5'}]}></View>
              <Image
                source={data.acceptTime ? require('../../../img/dot_color.png') : require('../../../img/dot.png')}
                style={styles.ic_dot}
              />
            </Flex>
            <Flex justify='center'>
              <View style={[styles.h_line, {backgroundColor: data.fetchTime ? '#f08300' : '#e5e5e5'}]}></View>
              <Image
                source={data.fetchTime ? require('../../../img/dot_color.png') : require('../../../img/dot.png')}
                style={styles.ic_dot}
              />
            </Flex>
            <Flex justify='center'>
              <View style={[styles.h_line, {backgroundColor: data.finishTime ? '#f08300' : '#e5e5e5'}]}></View>
              <Image
                source={data.finishTime ? (data.courierFinishAbnormalState ? require('../../../img/dot_red.png') : require('../../../img/dot_color.png')) : require('../../../img/dot.png')}
                style={styles.ic_dot}
              />
            </Flex>
          </Flex>
          <Flex justify='between' style={{paddingBottom: 15, marginRight: 10}}>
            <Flex justify='center'>
              <Text style={commonStyles.font12}>{data.orderCreateTime}</Text>
            </Flex>
            <Flex justify='center'>
              <Text style={[commonStyles.font12, {marginLeft: -25}]}>{data.acceptTime}</Text>
            </Flex>
            <Flex justify='center'>
              <Text style={[commonStyles.font12, {marginLeft: -25}]}>{data.fetchTime}</Text>
            </Flex>
            <Flex justify='center'>
              <Text style={[commonStyles.font12, {marginLeft: -25}]}>{data.finishTime}</Text>
            </Flex>
          </Flex>
        </View>
        <View>
          <Flex style={{height: 44, marginLeft: 15}}>
            <Text style={commonStyles.font13}>订单信息</Text>
          </Flex>
          <View style={{ backgroundColor: '#fff', paddingLeft: 15, paddingTop: 15}}>
            <Flex style={{marginBottom: 15}}>
              <Text style={commonStyles.font13}>业务类别</Text>
              <Text style={[commonStyles.font14, {marginLeft: 15}]}>{data.orderWayName}</Text>
            </Flex>
            {data.orderWay == 'applet-fast' ? 
              <Flex style={{marginBottom: 15}}>
                <Text style={commonStyles.font13}>一键下单单号</Text>
                <Text style={[commonStyles.font14, {marginLeft: 15}]}>{data.thirdOrderViewId}</Text>
              </Flex> : null
            }
            <Flex style={{marginBottom: 15}}>
              <Text style={commonStyles.font13}>订单号码</Text>
              <Text style={[commonStyles.font14, {marginLeft: 15}]}>{data.expressOrderId}</Text>
            </Flex>
          </View>
        </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  time: {
    height: 55,
    width: '100%',
    backgroundColor: '#fff'
  },
  v_line: {
    width: 1,
    height: 25,
    backgroundColor: '#e5e5e5'
  },
  h_line: {
    width: 60,
    height: 1,
    marginHorizontal: 10
  },
  ic_dot: {
    width: 18,
    height: 18,
    resizeMode: 'contain'
  },
  info: {
    marginBottom: 10,
  },
})