import React, { Component } from 'react'
import {
  DeviceEventEmitter,
  Linking,
  Text
} from 'react-native'
import {
  Toast,
  Modal
} from 'antd-mobile'
import api from '../api';
import Request from '../common/request';
import commonStyles from '../commonStyle';

// 公共方法抽取
export default commonMethods = {
  // 判断设备是否支持拨打电话
  _callVolid(phone) {
    const url = 'tel:' + phone;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        Alert.alert('提示','您的设备不支持该功能，请手动拨打 ' + phone, [{text: "确定"}]);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => Toast.info('出错了：' + err, 1.5));
  },
  // 接单
  _receiveOrder(orderId, navigation, isGoback) {
    Request.post(global.nav, `${api.receiveBtn}${orderId}`)
    .then((res) => {
      if (res.ok) {
        // 确认接单成功
        Toast.info('确认接单成功~');
        if(isGoback) {
          navigation.goBack();
        }
        // 1秒后重新加载页面
        setTimeout(() => {
          DeviceEventEmitter.emit('waitReceive');
          DeviceEventEmitter.emit('orderReceive');
        }, 1000)
      } else {
        Toast.info(JSON.parse(res._bodyInit).message, 1.5);
      }
    }).catch((err) => {
      Toast.info(err, 1.5);
    })
  },
  // 确认取件请求
  _comfirmPick(orderId, navigation, isGoback) {
    Request.post(global.nav, `${api.takeBtn}${orderId}`)
    .then((res) => {
      if(res.ok) {
        // 确认接单成功
        Toast.info('确认取单成功，请到“配送中”页面中查看~');
        if(isGoback) {
          navigation.goBack();
        }
        // 1.5秒后重新加载页面
        setTimeout(() => {
          DeviceEventEmitter.emit('waitPickup');
          DeviceEventEmitter.emit('orderReceive');
        }, 1000)
      } else {
        Toast.info(JSON.parse(res._bodyInit).message, 1.5);
      }
    }).catch((err) => {
      Toast.info(err, 1.5);
    })
  },
  // 确认已送达
  _confirmSend(orderId, courierFinishAbnormalState, navigation, isGoback) {
    const para = {
      courierFinishAbnormalState
    }
    Request.post(global.nav, `${api.deliveryBtn}${orderId}`, JSON.stringify(para))
    .then((res) => {
      if(res.ok) {
        // 确认接单成功
        Toast.info('已确认送达，请到“历史订单”中查看~');
        if(isGoback) {
          navigation.goBack();
        }
        // 1.5秒后刷新页面
        setTimeout(() => {
          DeviceEventEmitter.emit('delivering');
          DeviceEventEmitter.emit('orderReceive');
        }, 1000)
      } else {
        Toast.info(JSON.parse(res._bodyInit).message, 1.5);
      }
    }).catch((err) => {
      Toast.info(err, 1.5);
    })
  },
  // 获取跑腿订单商品明细
  async _getProxydetail(orderId) {
    let Lists = {};
    let data = await Request.get(global.nav, `${api.proxyDetail}${orderId}`);
    data = JSON.parse(data._bodyInit);
    if(data) {
      if(data.result) {
        Lists = data.result;
      } else {
        Toast.info(data.message, 1.5)
      }
    }
    return Lists
  },
  // 根据经纬度计算距离
  _conputeDistance(lat1, lng1, lat2, lng2) {
    const EARTH_RADIUS = 6378.137;    //单位KM
    const radLat1 = lat1 * Math.PI / 180.0;
    const radLat2 = lat2 * Math.PI / 180.0;
    const a = radLat1 - radLat2;
    const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000.0
    return s
  },
  // 日期格式化为'2018-06-01'格式
  _dateFormat(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    const formatdate = `${year}-${month}-${day}`;
    return formatdate
  }

}