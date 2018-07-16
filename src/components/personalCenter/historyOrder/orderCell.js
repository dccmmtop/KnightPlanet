import React, {PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewPropTypes
} from 'react-native'
import {
  Flex
} from 'antd-mobile'
import commonStyles from '../../../commonStyle'

class orderCell extends PureComponent {
  render() {
    let { data } = this.props;
    return (
      <TouchableOpacity 
        style={commonStyles.listItem} 
        key={data.expressOrderId} 
        onPress={() => this.props.navigation.navigate('HistoryDetail', {data: data})}>
        <Flex style={commonStyles.line2}>
          <Text style={[commonStyles.p1, {marginRight: 8}]}>订单</Text>
          <Text style={commonStyles.p1}>{data.expressOrderId}</Text>
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
        </Flex>
        <Flex justify='around' style={[commonStyles.border_top, {height: 44}]}>
          <Text style={commonStyles.font11}>用时{data.distributionTimeFormat}分钟</Text>
          <View style={styles.v_line}></View>
          <Text style={commonStyles.font11}>距离{data.deliveryDistancekm}km</Text>
          <View style={styles.v_line}></View>
          <Text style={commonStyles.font10}>&yen;&nbsp;{data.courierSettleAmount}</Text>
        </Flex>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  v_line: {
    width: 1,
    height: 25,
    backgroundColor: '#e5e5e5'
  }
})

export default orderCell
