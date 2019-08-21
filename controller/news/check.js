const $ = require('../../utils/common');
const moment = require('moment');

class CheckComponent {
  constructor() {}

  async checkNewsParam (ctx) {
    const { title, summary, content, poster } = ctx.request.body;
    if (!title || !summary || !content || !poster) {
      ctx.body = {
        code: 999,
        msg: "新闻发布失败，参数不正确！"
      };
      return;
    }

    if (title.length > 25) {
      ctx.body = {
        code: 999,
        msg: "标题最多可输入25个中文"
      };
      return;
    }

    if (summary.length > 200) {
      ctx.body = {
        code: 999,
        msg: "摘要最多可输入200个中文"
      };
      return;
    }

    // if (!$.isFormatDate(create_time)) {
    //   ctx.body = {
    //     code: 999,
    //     msg: "日期格式不符合要求 "
    //   };
    //   return;
    // }

    // 获取当前日期的年月日进行比较
    // let currentDate = moment(+new Date())
    //   .format("YYYY-MM-DD")
    //   .split("-");
    // let createdTime = $.isCurrentDay(create_time);
    // if (
    //   currentDate[0] !== createdTime[0] ||
    //   (currentDate[0] === createdTime[0] && currentDate[1] > createdTime[1]) ||
    //   (currentDate[0] === createdTime[0] &&
    //     currentDate[1] === createdTime[1] &&
    //     createdTime[2] < currentDate[2])
    // ) {
    //   ctx.body = {
    //     code: 999,
    //     msg: "请选择当天以及当天以后的日期"
    //   };
    //   return;
    // }
  }
}

module.exports = CheckComponent;
