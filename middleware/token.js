const jwt = require("jsonwebtoken");
const { TOKEN_ENCODE_STR, URL_YES_PASS } = require("../utils/config");
const User = require("../db").User;

const TokenMiddleware = {
  // 生成token
  createToken(str) {
    if (typeof str !== "string") {
      throw new Error("The parameter must be String");
    }

    return jwt.sign({ str }, TOKEN_ENCODE_STR, { expiresIn: "2h" });
  },

  // 验证登录 token 是否正确  => 写成中间件
  // get 请求与设置的请求不拦截验证，其余均需登录
  async checkToken(ctx, next) {
    const url = ctx.url;
    if (ctx.method !== "GET" && !URL_YES_PASS.includes(url)) {
      // 获取请求头中携带的token参数
      let token = ctx.get("Authorization");
      if (!token) {
        ctx.response.status = 401;
        ctx.body = {
          code: 401,
          msg: "你还没有登录，快去登录吧!"
        };
        return;
      }

      try {
        // 验证token是否过期
        let { str = "" } = await jwt.verify(token, TOKEN_ENCODE_STR);
        let userName = await User.find({ user_name: str });

        if (userName.length == 0) {
          ctx.response.status = 401;
          ctx.body = {
            code: 401,
            msg: "登录过期，请重新登录!"
          };
          return;
        }
        // 保存用户的_id，便于操作
        ctx._id = userName[0]._id;
      } catch (e) {
        ctx.response.status = 401;
        ctx.body = {
          code: 401,
          msg: "登录已过期请重新登录!"
        };
        return;
      }
    }

    await next();
  }
}

module.exports = TokenMiddleware;
