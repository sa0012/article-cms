const { isPWD } = require("../../utils/common");

class CheckUser {
  async checkUserParams(ctx) {
    let { user_name, user_pwd } = ctx.request.body;
    if (!user_name || !user_pwd) {
      ctx.body = {
        code: 999,
        msg: "请填写完整表单!"
      };
      return;
    }

    if (!isPWD(user_name)) {
      ctx.body = {
        code: 999,
        msg: "用户名为6-12位英文或者数字！"
      };
      return;
    }

    if (!isPWD(user_pwd)) {
      ctx.body = {
        code: 999,
        msg: "密码为6-12位英文或者数字！"
      };
      return;
    }
  }
}

module.exports = CheckUser;
