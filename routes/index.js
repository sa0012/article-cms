const router = require('koa-router')();
const controller = require('../controller');
const WEB_API = '/web-api'
router.get('/', async (ctx, next) => {
    ctx.body = "welcome to insaic CMS"
  })
  // 用户登录注册
  .post(`${WEB_API}/user/register`, controller.user.register)
  // 用户登录
  .post(`${WEB_API}/user/signIn`, controller.user.signIn)

  // 新闻发布
  .post(`${WEB_API}/news/publishNews`, controller.news.publishNews)
  // 保存草稿
  .post(`${WEB_API}/news/saveContent`, controller.news.saveContent)
  // 修改新闻
  .post(`${WEB_API}/news/updateNews`, controller.news.updateNews)
  // 删除新闻
  .post(`${WEB_API}/news/deleteNews`, controller.news.deleteNews)
  // 查询所有的新闻数据(包含草稿信息)
  .post(`${WEB_API}/news/queryAllNews`, controller.news.queryAllNews)
  // 查询所有的新闻数据(不包含草稿信息，产品数据)
  .post(`${WEB_API}/news/queryAllRealNews`, controller.news.queryAllNews)
  // 查询新闻详情
  .post(`${WEB_API}/news/newsDetails`, controller.news.newsDetails)
  // 按标题模糊查询
  .post(`${WEB_API}/news/fuzzyQueryNews`, controller.news.fuzzyQueryNews)
  // 按时间范围查询
  .post(`${WEB_API}/news/timeToQuery`, controller.news.timeToQuery)
  // 查询文章草稿
  .get(`${WEB_API}/news/queryDraft`, controller.news.queryDraft)

  // 图片上传
  .post(`${WEB_API}/upload/uploadSingleImg`, controller.upload.uploadSingleImg)
  // 删除图片
  .post(`${WEB_API}/upload/deleteImg`, controller.upload.deleteImg)
  // 多张图片上传
  .post(`${WEB_API}/upload/uploadManyImg`, controller.upload.uploadManyImg)
module.exports = router