import React, { Component } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import color from './widget/color' // 主要颜色文件
import screen from './common/screen'

const {height, width} = Dimensions.get('window');
// 公共样式抽离（写的不好，望指正）
const commonStyles = StyleSheet.create({

  // 常用字体颜色、大小、粗细组合
  font1: {
    fontSize: 17,
    fontWeight: 'bold',
    color: color.importantFont
  },
  font2: {
      fontSize: 17,
      color: color.font,
  },
  font3: {
      fontSize: 17,
      color: color.primary,
  },
  font4: {
      fontSize: 25,
      fontWeight: 'bold',
      color: color.red,
  },
  font5: {
      fontSize: 15,
      color: color.red
  },
  font6: {
    fontSize: 17,
    color: color.importantFont
  },
  font7: {
    fontSize: 17,
    fontWeight: 'bold',
    color: color.primary,
  },
  font8: {
    fontSize: 14,
    color: '#999999'
  },
  font9: {
    fontSize: 20,
    color: color.red
  },
  font10: {
    fontSize: 17,
    color: color.red
  },
  font11: {
    fontSize: 13,
    color: color.font,
    lineHeight: 15
  },
  font12: {
    fontSize: 12,
    color: color.importantFont
  },
  font13: {
    fontSize: 15,
    color: color.font
  },
  font14: {
    fontSize: 15,
    color: color.importantFont
  },
  font15: {
    fontSize: 13,
    color: color.primary,
  },
  font16: {
    fontSize: 13,
    color: color.importantFont,
  },
  font17: {
    fontSize: 14,
    color: color.red
  },
  font18: {
    fontSize: 14,
    color: color.importantFont,
  },
  font19: {
    fontSize: 12,
    color: color.font,
  },
  font20: {
    fontSize: 12,
    color: color.primary,
  },
  // 按钮中白色字体
  pbton: {
    fontSize: 17,
    color: '#ffffff'
  },
  // 拨打电话等可以点击字体
  pclick: {
    fontSize: 14,
    color: '#161c60'
  },
  p1: {
    fontSize: 14,
    color: color.font
  },
  p2: {
    fontSize: 14,
    color: '#ffffff'
  },
  p3: {
    fontSize: 14,
    color: color.primary
  },
  p4: {
    fontSize: 15,
    color: color.primary
  },
  // 常用边框
  border_bottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5'
  },
  border_top: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5'
  },
  // 常用边距抽离
  // 价格数字底部对齐
  marginTop1: {
    marginTop: -4
  },
  // 价格符号底部对齐
  marginTop2: {
    marginTop: 2
  },
  // 历史订单页价格对齐
  marginTop3: {
    marginTop: -3
  },
  marginRight10: {
    marginRight: 10
  },
  marginLeft10: {
    marginLeft: 10
  },
  marginLeft15: {
    marginLeft: 15
  },
  marginRight15: {
    marginRight: 15
  },
  marginLeft30: {
    marginLeft: 30
  },
  margin30_left_right: {
    marginHorizontal: 30
  },
  padding10_top_bottom: {
    paddingVertical: 10
  },
  padding15_top_bottom: {
    paddingVertical: 15
  },

  // 地址栏进度条样式
  timeChart: { 
    width: 12,
    paddingLeft: 4, 
    paddingRight: 4,
    resizeMode: 'contain'
  },
  timeChart1: {
    marginTop: -25,
    height: 12,
  },
  timeChart2: {
    position: 'absolute',
    top: 45,
    height: 48
  },

  // 按钮样式
  // “接单”类按钮样式
  primaryBtn1: {
    height: 55,
    backgroundColor: color.primary,
    borderRadius: 2
  },
  // “确认送达”类按钮样式
  primaryBtn2: {
    height: 44,
    backgroundColor: color.primary,
    borderRadius: 2
  },
  // "转单"类按钮样式
  primaryBtn3: {
    height: 55,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: color.primary
  },
  // 联系商家/用户
  primaryBtn4: {
    width: 78,
    height: 30,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 2
  },

  // icon通用样式
  // “打电话”
  order_call: {
    width: 13,
    height:14,
    marginRight: 10
  },
  // “时钟”
  time_meter: {
    width: 14,
    height: 16,
    paddingLeft: 3,
    paddingRight: 3
  },

  // 页面布局样式
  // 页面总体样式
  wrapper: {
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#f8f8f8'
  },
  container: {
    width: '100%',
    // height: '100%'
  },
  container2: {
    paddingHorizontal: 15,
    backgroundColor: '#ffffff'
  },
  myTitle: {
    width: '100%',
    height: 44,
    backgroundColor: '#ffffff'
  },
  // 页面list每一个小块的
  listItem: {
    marginTop: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff'
  },
  line1:{
    height: 48
  },
  line2: {
    height: 44
  },
  line3: {
    height: 40
  },
  // 横向布局、元素居中
  itemRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  // 横向布局、元素均匀分布
  itemJustify_between: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  // 横向布局、元素水平垂直都居中
  itemJustify_center: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  //垂直布局、元素居左
  itemCol: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  // 垂直布局、元素水平居中
  itemCol_center: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  // 垂直布局、元素均匀分布
  itemCol_between: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  // 垂直布局、垂直水平居中
  itemCol_bothCenter: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // 无订单
  noorder_box: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -60,
    marginLeft: -76
  },
  no_order: {
    width: 120,
    height: 152,
    resizeMode: 'contain'
  },
  ic_word: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  ic_contanct: {
    width: 15,
    height: 15,
    resizeMode: 'contain'
  },
  // flatlist提示语样式
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 44,
  },
  footerText: {
      fontSize: 14,
      color: '#555555'
  },
  // 提示框样式
  modal: {
    backgroundColor: '#fff'
  },
  info_title: {
    height: 80
  },
  title_txt: {
    fontSize: 16,
    color: color.importantFont,
    fontWeight: 'bold',
    lineHeight: 60
  },
  contain_txt: {
    fontSize: 15,
    color: color.importantFont,
    lineHeight: 20,
    marginBottom: 35
  },
  contain_txt1: {
    fontSize: 15,
    color: color.importantFont,
    lineHeight: 25
  },
  btn_line: {
    width: 1,
    height: 55,
    backgroundColor: '#e5e5e5'
  },
  cancel_txt: {
    fontSize: 16,
    color: '#999999',
    lineHeight: 55
  },
  confirm_txt: {
    fontSize: 16,
    color: color.primary,
    lineHeight: 55
  },
  num_circle: {
    height: 25,
    borderWidth: 1,
    borderColor: color.primary,
    borderRadius: 12.5
  },
  num_width: {
    width: 25
  },
  num_padding: {
    paddingHorizontal: 10
  },
  num_txt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: color.primary
  },
  font_order: {
    fontSize: 12,
    color: '#999'
  },
  // 订单列表公共样式
  order_line: {
    width: '100%'
  },
  line3_contain: {
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
    marginHorizontal: 15
  },
  order_txt4: {
    fontSize: 20,
    color: '#121212',
    fontWeight: 'bold'
  },
  order_txt5: {
    fontSize: 12,
    color: '#ff8200',
    marginRight: 5
  },
  drop_btn: {
    width: 50,
    height: 22,
    borderWidth: 1,
    borderColor: '#c0c0c0',
    borderRadius: 11
  },
  ic_arr: {
    width: 8.5,
    height: 5,
    resizeMode: 'contain',
    marginLeft: 5
  },
  order_listbg: {
    backgroundColor: '#fffceb'
  },
  proxy_box: {
    height: 20,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#1ba5e4',
    marginLeft: 10
  },
  proxy_txt: {
    fontSize: 12,
    color: '#1ba5e4'
  }
})

export default commonStyles
