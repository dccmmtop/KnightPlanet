import Request from "../common/request";

export function getThunkOrderList(A, B, C) {
  return async dispatch => {
    try {
      let data = await Request.get(A, B, C);
      let datajson = await data.json();
      dispatch({
        type: "GETThunkOrderList",
        data: datajson
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export const changeTab = nowPage => ({
  type: "CHANGETAB",
  nowPage
});

export const getListData = listData => ({
  type: "GETListData",
  listData
});
