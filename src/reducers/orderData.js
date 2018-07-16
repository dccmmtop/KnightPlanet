const initialState = {
  dataList: ""
};
const orderData = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGETAB":
      return Object.assign({}, state, action.nowPage);
    case "GETThunkOrderList":
      return Object.assign({}, state, action.data);
    case "GETListData":
      return action.listData;
    default:
      return state;
  }
};
export default orderData;
