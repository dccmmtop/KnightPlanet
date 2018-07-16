/* url统一ip配置 */

/* 本地环境 */
// const urlConfig = 'https://s.frp.jiabangou.com/api/express';

/* 测试环境 */
const urlConfig = "https://wbd.api.t.jiabangou.com/api/express";

/* 正式环境 */
// const urlConfig = "https://api.jiabangou.com/api/express";

const api = {
  // 获取验证码
  sendVolidCode: urlConfig + "/sessions/send_valid_code",
  // 用户登录
  userLogin: urlConfig + "/sessions/create_token",
  // 配送员订单查询
  searchOrders: urlConfig + "/express_orders/courier",
  // 获取订单信息
  orderDetail: urlConfig + "/express_orders/",
  // 接单按钮
  receiveBtn: urlConfig + "/express_orders/receive/",
  // 取货按钮
  takeBtn: urlConfig + "/express_orders/take/",
  // 送达按钮
  deliveryBtn: urlConfig + "/express_orders/delivery/",
  // 跑腿商品下拉明细
  proxyDetail: urlConfig + "/express_orders/order_proxy_detail/",
  // 用户数据
  userDate: urlConfig + "/courier/fight_today",
  // 快递员实时位置
  liveLocation: urlConfig + "/courier/live_location",
  // 快递员下班
  offLine: urlConfig + "/courier/offline",
  // 快递员上班
  onLine: urlConfig + "/courier/online",
  // 转单
  switchOrder: urlConfig + "/orders/switch",
  // 转单人员列表
  switchList: urlConfig + "/orders/switch/courier",
  // 查询各种订单数量
  queryNums: urlConfig + "/express_orders/countorder",
  // 历史订单查询
  queryHistory: urlConfig + "/express_orders/courier_histoty",
  // 一键下单补录信息保存
  saveInputinfo: urlConfig + "/express_orders/fast/",
  // 根据手机号查询历史收货地址
  getDest: urlConfig + "/shop/addr/dest",
  // 版本更新提示
  versionUpdate:
    "https://api.qishixingqiu.com/api/common/client/version/express-android"
};
export default api;
