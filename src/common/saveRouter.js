// 退出时保存当前路径

let saveRouter = {}

saveRouter.save = (router) => {
  storage.save({
    key: 'lastRouter',
    data: router
  })
}
saveRouter.remove = () => {
  storage.remove({
    key: 'lastRouter'
  });
}

export default saveRouter
