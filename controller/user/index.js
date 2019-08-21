const User = require("../../db").User;
const sha1 = require("sha1");
// 用户信息加密字符串
const { PWD_ENCODE_STR } = require("../../utils/config");
const { createToken } = require("../../middleware/token");
const CheckUser = require("./checkUser");
const moment = require('moment');
const xss = require("xss");

class UserComponent extends CheckUser {
  constructor() {
    super();

    this.register = this.register.bind(this);
    this.signIn = this.signIn.bind(this);
  }
  /**
   * @name 用户注册
   * @param {String} user_name 用户名
   * @param {String} user_pwd 用户密码
   * @param {re_user_pwd} 用户密码确认
   */
  async register(ctx, next) {
    let { user_name, user_pwd, re_user_pwd } = ctx.request.body;
    try {
      // 参数校验
      this.checkUserParams(ctx);
      // 校验两次密码输入是否一致
      if (user_pwd != re_user_pwd) {
        ctx.body = {
          code: 999,
          msg: "注册失败，2次密码输入不一致!"
        };
        return;
      }

      // 查询该用户名是否已经注册过
      const res = await User.find({
        user_name
      });

      if (res.length != 0) {
        ctx.body = {
          code: 999,
          msg: "注册失败，该账号已经注册过，请重新换一个账号注册！"
        };
        return;
      }

      // 用户密码进行加密存储
      user_pwd = sha1(sha1(user_pwd + PWD_ENCODE_STR));
      // 生成token
      let token = await createToken(user_name);
      let create_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      let edit_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      user_name = xss(user_name);
      let result = await new User({
        user_name,
        user_pwd,
        create_time,
        edit_time
      }).save();
      let response = {}
      response.user_id = result._id;
      response.user_name = result.user_name;
      response.token = token;
      if (response.user_id) {
        ctx.body = {
          code: 200,
          msg: "恭喜你，注册成功!",
          result: response
        };
      } else {
        ctx.body = {
          code: 500,
          msg: "注册失败，服务器异常!"
        };
      }
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: "注册失败，服务器异常！"
      };
    }
  }

  /**
   * @name 用户登陆
   * @param {String} user_name 用户名
   * @param {String} user_pwd 用户密码
   */
  async signIn(ctx, next) {
    let { user_name, user_pwd } = ctx.request.body;
    try {
      // 校验用户参数
      this.checkUserParams(ctx);

      user_pwd = sha1(sha1(user_pwd + PWD_ENCODE_STR));
      let res = await User.find({
        user_name,
        user_pwd
      });

      if (res.length == 0) {
        ctx.body = {
          code: 401,
          msg: "登录失败，用户名或者密码错误!"
        };
        return;
      }

      let token = await createToken(user_name);
      let response = {}
      response.user_id = res[0]._id;
      response.user_name = res[0].user_name;
      response.token = token;
      if (response.user_id) {
        ctx.body = {
          code: 200,
          msg: "恭喜你，登录成功!",
          result: response
        }
      } else {
        ctx.body = {
          code: 500,
          msg: "登录失败，服务器异常!"
        };
      }
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: "登录失败，服务器异常!"
      };
    }
  }

  // 退出登录
  async signOut(ctx, next) {}
}

module.exports = new UserComponent();
