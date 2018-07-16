// 顶部tab
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import PropTypes from 'prop-types';

type Props = {
  goToPage: Function, // 跳转到对应tab的方法
  tabNames: Array, // tab名称
  tabNum:Array, // tab数字
  activeTab: number // 当前被选中的tab的index
}

export default class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabNum: props.tabNum
    }
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      tabNum: newProps.tabNum
    })
  }
  // 循环打印tab
  renderTabOption(tab, i) {
    const color = this.props.activeTab == i ? "#121212" : "#999999"; // 判断i是否是当前选中的tab，设置不同的颜色
    return (
      <TouchableOpacity onPress={()=>this.props.goToPage(i)} style={styles.tab} key={i}>
        <View style={styles.tabItem}>
          <View style={[styles.border, this.props.activeTab == i ? styles.border_active: null]}>
            <Text style={{color: color, marginTop: 10}}>
              {this.props.tabNames[i]}({this.state.tabNum[i]})
            </Text>
          </View>
        </View>
      </TouchableOpacity>
     );
  }
  
  render() {
    return (
      <View style={styles.tabs}>
        {this.props.tabNames.map((tab, i) => this.renderTabOption(tab, i))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    height: 44,
    backgroundColor: '#fff'
  },
  tab: {
    flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    alignItems: 'center',
    width: 80,
    height: 40
  },
  border_active: {
    borderBottomWidth: 2,
    borderBottomColor: '#ff8200'
  }
})
