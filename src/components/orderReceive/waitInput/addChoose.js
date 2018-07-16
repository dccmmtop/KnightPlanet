// 选择地址
import React, {PureComponent} from 'react'
import {
  View,
	Text,
	TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  ScrollView
} from 'react-native'
import{
	Flex,
	Toast
} from 'antd-mobile'
import LabidcLocation from 'react-native-labidc-location';
import commonStyles from '../../../commonStyle';
import Request from '../../../common/request';


export default class AddChoose extends PureComponent {
	static navigationOptions = (navigation) => ({
    title: '选择收货人地址'
  })
  constructor(props) {
		super(props)
		this.state = {
      searchKey: '', // 搜索关键词
      addList: [], // 搜索结果
			district: '', // 地区编码 adcode
			street: '', // 地区名字
			lat: '',
			lng: ''
		}
  }
  // 搜索
  async _search(text) {
    this.setState({
      searchKey: text
    })
    if(text == '') {
      this.setState({
        addList: []
      })
    } else {
      // 逆地址解析获取当前cityCode
      const url = `http://restapi.amap.com/v3/geocode/regeo?key=${global.amapkey}&location=${global.lng},${global.lat}`;
      const results = await Request.get(this.props.navigation, url);
      results = JSON.parse(results._bodyInit);
      // 发起搜索
      let json = {};
      json.keyWord = text; 
      json.poiType = "010000|020000|030000|040000|050000|060000|070000|080000|090000|100000|110000|120000|130000|140000|150000|160000|170000"; // 查看 https://lbs.amap.com/api/webservice/download 规则
      json.cityCode = results.regeocode ? results.regeocode.addressComponent.citycode : '';// 城市编码，逆地址解析得到
      json.pageSize = 20; // 每页行数
      json.currentPage = 1; //当前页码

      json.latitude = global.lat; //该三个字段必须全部填写才会生效，Double类型 选填
      json.longitude = global.lng; // Double类型 选填
      json.bound = 20000; // 选填

      // statusCode 返回0 表示正确，
      LabidcLocation.poiSearch(JSON.stringify(json), (statusCode, statusJson) => {
        // console.log(statusCode);
        // console.log(JSON.parse(statusJson));
        if(statusCode == 0) {
          this.setState({
            addList: JSON.parse(statusJson).pois
          })
        }
      });
    }
  }
  // 选择地址
  _chooseLists(item) {
    this.props.navigation.goBack();
    DeviceEventEmitter.emit('infoInput', item);
  }
	render() {
    const lists = this.state.addList.length ? this.state.addList.map((item, index) => {
      return(
        <TouchableOpacity onPress={() => this._chooseLists(item)}>
          <Flex direction='column' align='start' justify='center' style={[styles.addr_line, index == 0 ? null : commonStyles.border_top]}>
            <Text numberOfLines={1} style={commonStyles.font14}>{item.title}</Text>
            <Text numberOfLines={1} style={commonStyles.font_order}>{item.snippet}</Text>
          </Flex>
        </TouchableOpacity>
      )
    }) : null
		return(
			<View style={commonStyles.wrapper}>
				<View style={commonStyles.container2}>
          <Flex style={{height: 55}}>
            <Flex style={styles.search_box}>
              <Image
                source={require('../../../img/ic_search.png')}
                style={styles.search_ic}
              />
              <TextInput
                style={styles.textinput}
                placeholder="请输入收获地址：小区/大厦/学校"
                placeholderTextColor="#c0c0c0"
                underlineColorAndroid="transparent"
                value={this.state.searchKey}
                onChangeText={text => this._search(text)}
              />
            </Flex>
          </Flex>
          <ScrollView>
            {lists}
          </ScrollView>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
  search_box: {
    width: '100%',
    height: 35,
    borderRadius: 18,
		paddingHorizontal: 10,
		backgroundColor: '#f8f8f8'
  },
  search_ic: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginRight: 10
	},
	textinput: {
    flex: 1,
    fontSize: 15,
    color: '#121212',
    padding: 0, // 去掉安卓上面默认padding
  },
  addr_line: {
    height: 77,
    paddingHorizontal: 15
  }
})