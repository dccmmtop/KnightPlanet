import React, {PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'
import{
  Flex
} from 'antd-mobile'
import Modal from "react-native-modal";
import commonStyles from '../../../commonStyle'
import Button from '../../../widget/Button'
import commonMethods from '../../../common/commonMethods'

export default class PickCell extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
      isModalVisible: false,
      isModalVisible1: false,
      isOpen: false,
      Lists: {} // 下拉商品列表
		}
    this._changeList = this._changeList.bind(this);
  }
  _toggleModal = () =>
  this.setState({ isModalVisible: !this.state.isModalVisible });
  _toggleModal1 = () =>
  this.setState({ isModalVisible1: !this.state.isModalVisible1 });
  // 确认送达
  _confirm(destLat, destLng) {
    // 计算到目的地的直线距离
    const distance = commonMethods._conputeDistance(destLat, destLng, global.lat, global.lng) * 1000;
    if(distance > 300) {
      this._toggleModal1()
    } else {
      this._toggleModal()
    }
  }
  // 确认送达弹窗
  _confirmSend(orderId, courierFinishAbnormalState) {
    if(this.state.isModalVisible) {
      this._toggleModal()
    }
    if(this.state.isModalVisible1) {
      this._toggleModal1()
    }
    commonMethods._confirmSend(orderId, courierFinishAbnormalState)
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
    let { data } = this.props;
    const { isOpen, Lists} = this.state;
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
      <View style={commonStyles.listItem} key={data.expressOrderId}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('OrderDetail', {type: 'delivering', data: data})}>
          <Flex justify='between' style={commonStyles.line1}>
            <Flex>
              <Text style={[commonStyles.p1, {marginRight: 10}]}>送达倒计时</Text>
              <Text style={data.restTime < 3 ? commonStyles.font17 : commonStyles.font18}>{data.restTime < 0 ? '已超过' : ''}{Math.abs(data.restTime)}分钟</Text>
            </Flex>
            <TouchableOpacity onPress={() => commonMethods._callVolid(data.destMobile)}>
              <Flex justify='center' style={commonStyles.primaryBtn4}>
                <Image
                  source={require('../../../img/contact_user.png')}
                  style={[commonStyles.ic_contanct, {marginRight: 5}]}
                />
                <Text style={commonStyles.font19}>联系用户</Text>
              </Flex>
            </TouchableOpacity>
          </Flex>
          {data.orderWay == 'applet-fast' ? 
            <Flex justify='between' style={commonStyles.line3}>
              <Flex justify='center' style={[commonStyles.num_circle, data.thirdOrderViewId > 9 ? commonStyles.num_padding : commonStyles.num_width]}>
                <Text style={commonStyles.num_txt}>{data.thirdOrderViewId}</Text>
              </Flex>
              <Text style={commonStyles.font20}>一键下单</Text>
            </Flex> : null
          }
          <Flex direction='column' align='start'>
            <Flex justify='between' style={[commonStyles.padding15_top_bottom, {width: '100%'}]}>
              <Flex>
                <Image
                  source={require('../../../img/ic_qu_40.png')}
                  style={[commonStyles.ic_word, commonStyles.marginRight15]}
                />
                <Text numberOfLines={2} style={[commonStyles.font1, {lineHeight: 20}]}>{data.fromBusinessName}</Text>
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
            <Flex style={commonStyles.padding15_top_bottom}>
              <Image
                source={require('../../../img/ic_song_40.png')}
                style={[commonStyles.ic_word, commonStyles.marginRight15]}
              />
              <Flex style={{flex: 1}}>
                <Text numberOfLines={2} style={[commonStyles.font1, {lineHeight: 20}]}>{data.destAddr}</Text>
              </Flex>
            </Flex>
            <Flex>
              <Text style={[commonStyles.font6, {flex: 1, marginLeft: 35, paddingBottom: 15}]}>{data.destName}</Text>
            </Flex>
          </Flex>
        </TouchableOpacity>
        {data.orderWay == 'jbg-proxy' ? 
          <View style={[commonStyles.order_line]}>
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
        <Button
          disabled={false}
          style={[commonStyles.primaryBtn1, {flex: 1}]}
          titleStyle={commonStyles.pbton} 
          title='确认送达'
          onPress={() => this._confirm(data.destLat, data.destLng)}
          opacity={1}
        />
        <Flex style={commonStyles.line3}>
          <View style={{marginRight: 10}}>
            <Text style={commonStyles.font_order}>订单号</Text>
          </View>
          <Text style={commonStyles.font_order}>{data.expressOrderId}</Text>
        </Flex>
        <Flex style={{flex: 1}}>
          <Modal isVisible={this.state.isModalVisible}>
            <Flex direction='column' style={{backgroundColor: '#fff'}}>
              <Flex justify='center' style={commonStyles.info_title}>
                <Text style={commonStyles.title_txt}>配送确认</Text>
              </Flex>
              <Flex justify='center' style={{marginBottom: 35}}>
                <Text style={commonStyles.contain_txt}>确定<Text style={[commonStyles.font7, {marginHorizontal: 5}]}>{data.destName}</Text>的商品已送达？</Text>
              </Flex>
              <Flex justify='between' style={[{width: '100%'}, commonStyles.border_top]}>
                <TouchableOpacity style={{flex: 1}} onPress={this._toggleModal}>
                  <Flex justify='center'>
                    <Text style={commonStyles.cancel_txt}>取消</Text>
                  </Flex>
                </TouchableOpacity>
                <View style={commonStyles.btn_line}></View>
                <TouchableOpacity style={{flex: 1}}  onPress={() =>this._confirmSend(data.expressOrderId, false)}>
                  <Flex justify='center'>
                    <Text style={commonStyles.confirm_txt}>确定</Text>
                  </Flex>
                </TouchableOpacity>
              </Flex>
            </Flex>
          </Modal>
          <Modal isVisible={this.state.isModalVisible1}>
            <Flex direction='column' style={{backgroundColor: '#fff'}}>
              <Flex justify='center' style={{marginTop: 20, marginBottom: 35}}>
                <Image
                  source={require('../../../img/ic_remind.png')}
                  style={{width: 60, height: 60, resizeMode: 'contain'}}
                />
              </Flex>
              <Flex direction='column' justify='center' style={{marginBottom: 35}}>
                <Flex justify='center'>
                  <Text style={commonStyles.contain_txt1}>您距离配送地址还有一段距离哦~</Text>
                </Flex>
                <Flex justify='center'>
                  <Text style={commonStyles.contain_txt1}>是否确认送达？</Text>
                </Flex>
              </Flex>
              <Flex justify='between' style={[{width: '100%'}, commonStyles.border_top]}>
                <TouchableOpacity style={{flex: 1}}  onPress={() =>this._confirmSend(data.expressOrderId, true)}>
                  <Flex justify='center'>
                    <Text style={commonStyles.confirm_txt}>确认送达</Text>
                  </Flex>
                </TouchableOpacity>
                <View style={commonStyles.btn_line}></View>
                <TouchableOpacity style={{flex: 1}} onPress={this._toggleModal1}>
                  <Flex justify='center'>
                    <Text style={commonStyles.cancel_txt}>取消</Text>
                  </Flex>
                </TouchableOpacity>
              </Flex>
            </Flex>
          </Modal>
        </Flex>
      </View>
    )
	}
}

const styles = StyleSheet.create({

})

