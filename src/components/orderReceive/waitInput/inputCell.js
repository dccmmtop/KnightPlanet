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
import commonStyles from '../../../commonStyle'
import Button from '../../../widget/Button'
import commonMethods from '../../../common/commonMethods'

export default class InputCell extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
            
		}
  }
  _comfirmPick(orderId) {
    commonMethods._comfirmPick(orderId);
  }
	render() {
		let { data } = this.props;
    return(
      <View style={commonStyles.listItem} key={data.expressOrderId}>
        <Flex justify='between' style={commonStyles.line1}>
          <Flex>
            <Text style={[commonStyles.p3, {marginRight: 10}]}>{data.expectFetchTime}</Text>
            <Text style={commonStyles.p1}>前取件</Text>
          </Flex>
          <TouchableOpacity onPress={() => commonMethods._callVolid(data.fromMobile)}>
            <Flex justify='center' style={commonStyles.primaryBtn4}>
              <Image
                source={require('../../../img/contact_shop.png')}
                style={[commonStyles.ic_contanct, {marginRight: 5}]}
              />
              <Text style={commonStyles.font19}>联系商家</Text>
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
          <Flex style={commonStyles.padding15_top_bottom}>
            <Image
              source={require('../../../img/ic_qu_40.png')}
              style={[commonStyles.ic_word, commonStyles.marginRight15]}
            />
            <Text numberOfLines={2} style={commonStyles.font1}>{data.fromBusinessName}</Text>
          </Flex>
          <Flex>
            <Text numberOfLines={2} style={[commonStyles.font11, {flex: 1, marginLeft: 35, paddingBottom: 15, lineHeight: 15}]}>{data.fromAddr}</Text>
          </Flex>
        </Flex>
        <Button
          disabled={false}
          style={[commonStyles.primaryBtn1, {flex: 1}]}
          imgSrc={require('../../../img/ic_input.png')}
          iconStyle={styles.ic_input}
          titleStyle={commonStyles.pbton} 
          title='录入收货人信息'
          onPress={() => this.props.navigation.navigate('InfoInput', {orderId: data.expressOrderId})}
          opacity={1}
        />
        <Flex style={commonStyles.line3}>
          <View style={{marginRight: 10}}>
            <Text style={commonStyles.font_order}>订单号</Text>
          </View>
          <Text style={commonStyles.font_order}>{data.expressOrderId}</Text>
        </Flex>
      </View>
    )
	}
}

const styles = StyleSheet.create({
  ic_input: {
    width: 19,
    height: 18,
    resizeMode: 'contain',
    marginRight: 10
  }
})

