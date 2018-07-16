// 唤醒手机自带第三方地图APP
// 目前支持 android：高德地图、百度地图  ios: 高德地图、百度地图、苹果地图

import { Linking, ActionSheetIOS, Alert, Platform } from 'react-native';

function openDialog(urls) {
  if (Platform.OS === 'ios') {
    urls = urls.ios;
    return Promise.all(urls.map(element => Linking.canOpenURL(element[1])))
      .then((results) => {
        return urls.filter((element, index) => results[index]);
      }).then(choices => {
        // 系统内没有任何地图, 推荐下载一个
        if (choices.length < 1) {
          return ActionSheetIOS.showActionSheetWithOptions({
            options: ['下载高德地图', '下载百度地图', '取消'],
            cancelButtonIndex: 2,
            title: '选择地图',
          }, buttonIndex => {
            if (buttonIndex === 0) {
              Linking.openURL('https://itunes.apple.com/cn/app/gao-tu-zhuan-ye-shou-ji-tu/id461703208?mt=8');
            } else if (buttonIndex === 1) {
              Linking.openURL('https://itunes.apple.com/cn/app/bai-du-tu-shou-ji-tu-lu-xian/id452186370?mt=8');
            }
          });
        }

        return ActionSheetIOS.showActionSheetWithOptions({
          options: [...(choices.map(element => element[0])), '取消'],
          cancelButtonIndex: choices.length,
          title: '选择地图',
        }, buttonIndex => {
          if (buttonIndex < choices.length) {
            Linking.openURL(choices[buttonIndex][1]);
          }
        });
      });
  } else if (Platform.OS === 'android') {
    urls = urls.android;
    return Promise.all(urls.map(element => Linking.canOpenURL(element[1])))
      .then((results) => {
        return urls.filter((element, index) => results[index]).map(url => ({
          text: url[0],
          onPress: () => {
            Linking.openURL(url[1]);
          },
        }));
      }).then(choices => {
        // 系统内没有任何地图, 推荐下载一个
        if (choices.length < 1) {
          return Alert.alert('选择地图', '您还没有安装地图软件。', [
            { text: '下载高德地图', onPress: () => Linking.openURL('http://mobile.amap.com') },
            { text: '下载百度地图', onPress: () => Linking.openURL('http://map.baidu.com') },
            { text: '取消' }
          ]);
        }

        return Alert.alert('选择地图', '请选择一个地图打开', [...choices, { text: '取消' }]);
      });
  }
}

export default {
  options: { appName: 'MapLinking' },

  setOptions(opts) {
    this.options = { ...this.options, ...opts };
  },

  /**
   * 在地图上标注指定位置
   *
   * @param location 位置, {lat:40, lng: 118, type: 'gcj02'}
   * @param title    标题
   * @param content  内容
   */
  markLocation(location, title, content) {
    return openDialog({
      android: [
        [
          '高德地图',
          `androidamap://viewMap?sourceApplication=${this.options.appName}&poiname=${title}&lat=${location.lat}&lon=${location.lng}&dev=${location.type === 'gcj02' ? '0' : '1'}`,
        ],
        [
          '百度地图',
          `bdapp://map/marker?location=${location.lat},${location.lng}&coord_type=${location.type === 'gcj02' ? 'gcj02' : 'wgs84'}&title=${title}&content=${content}&src=${this.options.appName}`,
        ]
      ],
      ios: [
        [
          '高德地图',
          `iosamap://viewMap?sourceApplication=${this.options.appName}&poiname=${title}&lat=${location.lat}&lon=${location.lng}&dev=${location.type === 'gcj02' ? '0' : '1'}`,
        ],
        [
          '百度地图',
          `baidumap://map/marker?location=${location.lat},${location.lng}&coord_type=${location.type === 'gcj02' ? 'gcj02' : 'wgs84'}&title=${title}&content=${content}&src=${this.options.appName}`,
        ],
        [
          'iOS系统地图',
          `http://maps.apple.com/?ll=${location.lat},${location.lng}&q=${title}`,
        ],
      ],
    });
  },

  /**
   * 规划线路
   *
   * @param srcLocation  起始位置: {lat:40, lng: 118, title: '起点'} 可选，不填默认为当前位置
   * @param distLocation 目的位置: {lat:40, lng: 118, type: 'gcj02', title: '终点'} 必填
   * @param mode         交通方式: drive - 驾车, bus - 公交, walk - 步行, ride - 骑行 可选，默认为驾车
   *                     高德： 0 驾车；1 公交；2 步行；3 骑行
   *                     百度： transit（公交）、driving（驾车）、walking（步行）和riding（骑行）
   */
  planRoute(srcLocation, distLocation, mode) {
    return openDialog({
      android: [
        [
          '高德地图',
          `androidamap://route?sourceApplication=${this.options.appName}&slat=${srcLocation ? srcLocation && srcLocation.lat : ''}&slon=${srcLocation ? srcLocation && srcLocation.lng: ''}&sname=${srcLocation ? srcLocation && srcLocation.title : ''}&dlat=${distLocation.lat}&dlon=${distLocation.lng}&dname=${distLocation.title}&dev=${distLocation.type === 'gcj02' ? '0' : '1'}&m=0&t=${mode === 'drive' ? '0' : (mode === 'bus' ? '1' : (mode === 'walk' ? '2' : '3'))}`,
        ],
        [
          '百度地图',
          `bdapp://map/direction?origin=${srcLocation ? (srcLocation.lat + ',' + srcLocation.lng) : ''}&destination=${distLocation.lat},${distLocation.lng}&mode=${mode === 'drive' ? 'driving' : (mode === 'bus' ? 'transit' : (mode === 'ride' ? 'riding':  'walking'))}&coord_type=${distLocation.type === 'gcj02' ? 'gcj02' : 'wgs84'}&src=${this.options.appName}`,
        ]
      ],
      ios: [
        [
          '高德地图',
          `iosamap://path?sourceApplication=${this.options.appName}&slat=${srcLocation && srcLocation.lat}&slon=${srcLocation && srcLocation.lng}&sname=${srcLocation && srcLocation.title}&dlat=${distLocation.lat}&dlon=${distLocation.lng}&dname=${distLocation.title}&dev=${distLocation.type === 'gcj02' ? '0' : '1'}&t=${mode === 'drive' ? '0' : (mode === 'bus' ? '1' : (mode === 'walk' ? '2' : '3'))}`,
        ],
        [
          '百度地图',
          `baidumap://map/direction?origin=${srcLocation ? (srcLocation.lat + ',' + srcLocation.lng) : ''}&destination=${distLocation.lat},${distLocation.lng}&mode=${mode === 'drive' ? 'driving' : (mode === 'bus' ? 'transit' : 'walking')}&coord_type=${distLocation.type === 'gcj02' ? 'gcj02' : 'wgs84'}&src=${this.options.appName}`,
        ],
        [
          'iOS系统地图',
          `http://maps.apple.com/?ll=${distLocation.lat},${distLocation.lng}&q=${distLocation.title}&dirflg=${mode === 'drive' ? 'd' : (mode === 'bus' ? 'r' : 'w')}`,
        ],
      ],
    });
  },

  /**
   * 启动导航
   *
   * @param distLocation 目的位置: {lat:40, lng: 118, type: 'gcj02', title: '终点'}
   */
  navigate(distLocation) {
    return openDialog({
      android: [
        [
          '高德地图',
          `androidamap://navi?sourceApplication=${this.options.appName}&poiname=${distLocation.title}&lat=${distLocation.lat}&lon=${distLocation.lng}&dev=${distLocation.type === 'gcj02' ? '0' : '1'}`,
        ],
        [
          '百度地图',
          `bdapp://map/direction?origin=&destination=${distLocation.lat},${distLocation.lng}&mode=driving&coord_type=${distLocation.type === 'gcj02' ? 'gcj02' : 'wgs84'}&src=${this.options.appName}`,
        ]
      ],
      ios: [
        [
          '高德地图',
          `iosamap://navi?sourceApplication=${this.options.appName}&poiname=${distLocation.title}&lat=${distLocation.lat}&lon=${distLocation.lng}&dev=${distLocation.type === 'gcj02' ? '0' : '1'}`,
        ],
        [
          '百度地图',
          `baidumap://map/direction?origin=&destination=${distLocation.lat},${distLocation.lng}&mode=driving&coord_type=${distLocation.type === 'gcj02' ? 'gcj02' : 'wgs84'}&src=${this.options.appName}`,
        ],
        [
          'iOS系统地图',
          `http://maps.apple.com/?ll=${distLocation.lat + ',' + distLocation.lng}&q=${distLocation.title}&dirflg=d`,
        ],
      ],
    });
  },
};