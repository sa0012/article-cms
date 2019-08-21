module.exports = {
  imgPath: 'public/upload/',
  // 用户密码加密字符串
  PWD_ENCODE_STR: "insaic_user_encode_str",
  // token 加密字符串,
  TOKEN_ENCODE_STR: "insaic_token_encode_str",
  // 文章发布类型
  note_type: {
    is_publish: 'PUBLISH',
    is_draft: 'DRAFT'
  },
  // 跳过token验证的非get请求白名单
  URL_YES_PASS: [
    '/web-api/user/register',
    '/web-api/user/signIn',
    '/web-api/news/queryAllNews',
    '/web-api/news/newsDetails',
    '/web-api/news/fuzzyQueryNews',
    '/web-api/news/queryAllRealNews',
  ]
};
