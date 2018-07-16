import React, { PureComponent } from "react";
import {
	View,
	NativeModules,
	PushNotificationIOS,
	Platform
} from 'react-native'
import {
	StackNavigator,
} from 'react-navigation'

console.disableYellowBox = true; // 去除警告框

import Guide from './components/guide/guide'
import Login from './components/login/login'
import Protocol from './components/login/protocol';
import OrderReceive from './components/orderReceive/orderReceive';
import PersonalCenter from './components/personalCenter/personalCenter';
import HistoryOrder from './components/personalCenter/historyOrder/historyOrder';
import DetailCell from './components/personalCenter/DetailCell';
import OrderDetail from './components/orderReceive/orderDetail';
import HistoryDetail from './components/personalCenter/historyOrder/historyDetail';
import InfoInput from './components/orderReceive/waitInput/infoInput';
import AddChoose from './components/orderReceive/waitInput/addChoose';

class Main extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    if (Platform.OS === "android") {
      // 安卓平台获取设备token
      this.JsToNative();
    }
    global.jumpNum = 1;
  }
  componentDidMount() {
    if (Platform.OS === "ios") {
      // ios平台获取token
      PushNotificationIOS.addEventListener("register", this._register);
    }
  }
  componentWillUnmount() {
    PushNotificationIOS.removeEventListener("register", this._register);
  }
  JsToNative() {
    let XingGe = NativeModules.XingGe;
    XingGe.getToken(
      token => {
				// console.log(token, 11111111)
        global.token = token;
      },
      error => {
        global.token = "";
        //获取失败
        console.log(error);
      }
    );
  }
  _register(deviceToken) {
    global.token = deviceToken;
    storage.save({ key: "token", data: deviceToken });
  }

  render() {
    return <Navigator />;
  }
}

// 跳转路由配置
const Navigator = StackNavigator({
		InfoInput: {
			screen: InfoInput
		},
		AddChoose: {
			screen: AddChoose
		},
		OrderReceive: {
			screen: OrderReceive
		},
		PersonalCenter: {
			screen: PersonalCenter
		},
		HistoryDetail: {
			screen: HistoryDetail
		},
		OrderDetail: {
				screen: OrderDetail
		},
		Guide: {
				screen: Guide
		},
		Login: {
				screen: Login
		},
		Protocol: {
				screen: Protocol
		},
		DetailCell: {
				screen: DetailCell
		},
		PersonalCenter: {
				screen: PersonalCenter
		},
		HistoryOrder: {
				screen: HistoryOrder
		}
}, {
		initialRouteName: 'OrderReceive',
		backBehavior: 'none',
		animationEnabled: true,
		swipeEnabled: true,
		navigationOptions: {
				headerBackTitle: null,
				headerTintColor: '#333333',
				showIcon: true,
				gesturesEnabled: false, // 不支持ios滑动返回手势
				headerTitleStyle: {
						fontSize: 17,
						textAlign: 'center',
						flex: 1
				},
				headerRight: <View/>,
				headerStyle: {
						height: 44,
						backgroundColor: '#ffffff',
						elevation: 0
				}
		},
		lazy: true
})

export default Main;
