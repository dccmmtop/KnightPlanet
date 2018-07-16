// APP引导页面
import React, { PureComponent } from 'react'
import { View, StyleSheet, Image, Dimensions } from 'react-native'

import commonStyles from '../../commonStyle'

const { width } = Dimensions.get('window')
class Guide extends PureComponent {
  // 页面头部
  static navigationOptions = (navigation) => ({
    headerTitle: (
      <View></View>
    ),
    headerLeft: null,
    headerStyle: {
      height: 44,
      backgroundColor: '#ffffff',
      elevation: 0,
      borderBottomWidth: 0
    },
  })

  constructor() {
    super()
    this.state = {
    }
  }
  componentDidMount() {
  }
  render() {
    return (
      <View style={[commonStyles.container, { backgroundColor: '#ffffff' }]}>
        <View style={[commonStyles.itemCol_center, {}]}>
          <Image
            source={require('../../img/welcome_shape.gif')}
            style={styles.shape}
          />
          <Image
            source={require('../../img/welcome_logo.png')}
            style={styles.logo}
          />
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  shape: {
    width: 213,
    height: 25,
    marginTop: 166
  },
  logo: {
    position: 'absolute',
    bottom: 15,
    width: 110,
    height: 75
  }
})


export default Guide
