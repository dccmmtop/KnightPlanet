// 检查当前版本是否需要更新
import { NativeModules, Alert, Linking, Platform } from "react-native";
import { toastShort } from "../widget/Toast";
import LabidcUpdate from "react-native-labidc-update";
import api from "../api";
import Request from "../common/request";

export default (updateVersion = {
  /**
   * 更新版本
   */
  updateVersion() {
    // Toast.loading('正在检查版本..')
    Request.get({}, api.versionUpdate)
      .then(res => {
        if (res.ok) {
          const resjson = JSON.parse(res._bodyInit);
          if (Platform.OS === "android") {
            this.androidUpdate({
              versionCode: resjson.version,
              versionName: resjson.versionCode,
              jumpUrl: resjson.clientUrl
            });
          }
        }
      })
      .catch(err => {
        console.log("更新失败：", err);
      });
  },
  /**
   * 安卓更新
   * @returns {Promise.<void>}
   */
  androidUpdate() {
    LabidcUpdate.check(JSON.stringify(json), (statusCode, statusMsg) => {
      console.warn(statusCode);
      console.warn(typeof statusCode);
      console.warn(statusMsg);
    });
  },

  /**
   * 苹果更新
   */
  // iosUpdate() {
  //   let UpdateVersion = NativeModules.UpdateVersion;
  //   UpdateVersion.findEvents((error, events) => {
  //     // Toast.hide();
  //     if (events[0] != "") {
  //       this.alertMsg(events[0]);
  //     }
  //   });
  // },

  /**
   * 更新弹窗
   */
  alertMsg(url) {
    // Alert.alert("有新的版本", "  您需要更新吗？ ", [
    //   {
    //     text: "取消",
    //     onPress: () => console.log("cancel")
    //   },
    //   {
    //     text: "确认",
    //     onPress: () =>
    //       new Promise(resolve => {
    //         Linking.openURL(url);
    //       })
    //   }
    // ]);
  }
});
