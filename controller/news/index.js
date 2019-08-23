const Article = require("../../db").Article;
const xss = require("xss");
const $ = require("../../utils/common");
const CheckComponent = require("./check");
const path = require("path");
const moment = require('moment');
const { note_type } = require('../../utils/config');

class newsComponent extends CheckComponent {
  constructor() {
    super();
    this.publishNews = this.publishNews.bind(this);
    this.updateNews = this.updateNews.bind(this);
    this.saveContent = this.saveContent.bind(this);
  }

  /**
   * @name 新闻发布
   * @param {String} title // 标题
   * @param {String} summay // 摘要
   * @param {String} content // 新闻
   * @param {String} poster // 新闻封面图片
   */
  async publishNews(ctx, next) {
    let { title, summary, content, poster, _id, edit_time = '' } = ctx.request.body;
    if (!_id) {
      return ctx.body = {
        code: 999,
        msg: '文章ID不能为空'
      }
    }
    // 校验参数
    this.checkNewsParam(ctx);
    // 存库前先进行转义，防止xss攻击
    title = xss(title);
    summary = xss(summary);
    // content = xss(content);
    poster = xss(poster);

    try {
      edit_time = edit_time || moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      var timeNum = +(new Date(edit_time) || new Date())
      let options = {
        title,
        summary,
        content,
        poster,
        edit_time,
        timeNum,
        note_type: note_type.is_publish
      }

      let result = await Article.findOneAndUpdate({
        _id: _id
      }, options, {
        new: true
      })

      if (result._id) {
        ctx.body = {
          code: 200,
          msg: "新闻发布成功！",
          result: 'SUCCESS'
        };
      }
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: "服务器异常，请稍后重试！"
      };
    }
  }

  /**
   * @name 新闻草稿保存
   * @param {String} title // 标题
   * @param {String} summay // 摘要
   * @param {String} content // 新闻
   * @param {String} poster // 新闻封面图片
   */
  async saveContent(ctx, next) {
    let { title, summary, content, poster, edit_time = '', _id = '' } = ctx.request.body;
    // 校验参数
    this.checkNewsParam(ctx);
    // 存库前先进行转义，防止xss攻击
    title = xss(title);
    summary = xss(summary);
    // content = xss(content);
    poster = xss(poster);

    try {
      edit_time = edit_time || moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      var timeNum = +(new Date(edit_time) || new Date())
      let options = {
        title,
        summary,
        content,
        poster,
        edit_time,
        timeNum,
        note_type: note_type.is_draft
      }
      
      let result = null;
      if (!_id) {
        options.create_time = edit_time || moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        let ArticleList = new Article(options);
        result = await ArticleList.save();
      } else {
        result = await Article.findOneAndUpdate({
          _id: _id
        }, options, {
          new: true
        })
      }
      

      if (result._id) {
        ctx.body = {
          code: 200,
          msg: "新闻发布成功！",
          result: result
        };
      }
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: "服务器异常，请稍后重试！"
      };
    }
  }

  /**
   * @name 查询草稿
   * @param {*} ctx 
   * @param {*} next 
   */
  async queryDraft(ctx, next) {
    try {
      let result = await Article.find({ note_type: note_type.is_draft });
      ctx.body = {
        code: 200,
        result: result || [],
        msg: '查询草稿数据成功'
      }
    } catch(e) {
      ctx.body = {
        code: 500,
        msg: "服务器异常，请稍后重试！"
      };
    }
  }

  /**
   * @name 修改新闻
   * @param {String} _id // 新闻文章ID
   * @param {String} title // 标题
   * @param {String} summay // 摘要
   * @param {String} content // 新闻
   * @param {String} poster // 新闻封面图片
   * @param {String} edit_time // 发布时间
   */
  async updateNews(ctx, next) {
    let {
      _id,
      title,
      summary,
      content,
      poster
    } = ctx.request.body;

    if (!_id) {
      return (ctx.body = {
        code: 999,
        msg: "文章ID不能为空！"
      });
    }
    // 校验参数
    this.checkNewsParam(ctx);

    // 存库前先进行转义，防止xss攻击
    title = xss(title);
    summary = xss(summary);
    // content = xss(content);
    poster = xss(poster);
    const edit_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    var timeNum = +(new Date(edit_time) || new Date())
    try {
      await Article.findOneAndUpdate(
        {
          _id
        },
        {
          title,
          summary,
          content,
          poster,
          edit_time,
          timeNum
        },
        {
          new: true
        }
      )
        .then(async res => {
          ctx.body = {
            code: 200,
            result: res,
            msg: "修改新闻成功"
          };
        })
        .catch(err => {
          ctx.body = {
            code: 999,
            msg: "更新新闻失败，服务器异常！"
          };
        });
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: "服务器异常，请稍后重新！"
      };
    }
  }

  /**
   * @name 删除新闻
   * @param {String} _id // 新闻文章ID
   */
  async deleteNews(ctx, next) {
    let { _id } = ctx.request.body;
    if (!_id) {
      return (ctx.body = {
        code: 999,
        msg: "文章ID不能为空！"
      });
    }

    try {
      let result = null;
      await Article.findOneAndDelete({
        _id
      }).then(res => {
        result = res;
        let fileName = path.basename(res.poster);
        let queryPath = "public/upload/" + fileName;
        try {
          $.isExistFile(queryPath).then(res => {
            if (res) {
              $.deleteFile(queryPath);
            }
          });
        } catch (e) {
          throw new Error("delete error");
        }
      });

      if (result._id) {
        ctx.body = {
          code: 200,
          msg: "删除文章成功！"
        };
      }

    } catch (e) {
      ctx.body = {
        code: 500,
        msg: "服务器异常，请稍后重试！"
      };
    }
  }

  /**
   * @name 查询所有的新闻数据
   * @param {String | Number} page // 当前页数
   * @param {String | Number} size // 每页查询数量
   */
  async queryAllNews(ctx, next) {
    let { size = 10, page = 1 } = ctx.request.body;
    let url = ctx.url;
    let options = {
      skip: Number((page - 1) * size),
      limit: Number(size),
      sort: { timeNum: -1 }
    };

    let config = url === '/web-api/news/queryAllRealNews' ? { note_type: 'PUBLISH' } : {}

    try {
      let res = await Article.find(config, null, options);
      let totalResult = await Article.find(config);
      let total = totalResult.length;
      ctx.body = {
        code: 200,
        msg: "获取新闻数据成功！",
        result: {
          result: res,
          pagination: {
            total,
            page: Number(page),
            size: Number(size)
          }
        }
      };
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: "服务器异常，请稍后重试！"
      };
    }
  }

  /**
   * @name 查询新闻详情
   * @param {String} _id // 文章ID
   */
  async newsDetails(ctx, next) {
    let { _id, timeNum } = ctx.request.body;

    if (!_id || !timeNum) {
      return (ctx.body = {
        code: 999,
        msg: "文章ID不能为空！"
      });
    }

    try {
      await Article.findOne({
        _id
      })
        .then(async res => {
          let count = JSON.stringify(res.browser_count);
          count++;
          let result = await Article.findOneAndUpdate(
            {
              _id
            },
            {
              browser_count: count
            },
            {
              new: true
            }
          );

          // 根据当前ID查询上一条，下一条记录
          const prevResult = await Article.find({ timeNum: { $gte: timeNum }, note_type: 'PUBLISH' })
            .sort({ timeNum: 1 })
          const nextResult = await Article.find({ timeNum: { $lte: timeNum }, note_type: 'PUBLISH' })
            .sort({ timeNum: -1 })
          
          let prevIndex = 0;
          let nextIndex = 0;
          let prev = [];
          let next = [];
          console.log(prevResult.length, nextResult.length, 'length')
          if (prevResult.length > 0) {
            prevIndex = prevResult.findIndex(item => {
              return item._id == _id;
            });
            console.log(prevIndex, (prevIndex >= 0 && prevIndex < prevResult.length - 1), 'pIndex')
            if (prevIndex >= 0 && prevIndex < prevResult.length - 1) {
              console.log(prevResult[prevIndex + 1], 'prev')
              prev = [prevResult[prevIndex + 1]]
            }
          }
          if (nextResult.length > 0) {
            nextIndex = nextResult.findIndex(item => {
              return item._id == _id;
            });
            console.log(nextIndex, 'nIndex')
            if (nextIndex >= 0 && nextIndex < nextResult.length - 1) {
              console.log(nextResult[nextIndex + 1], 'next')
              next = [nextResult[nextIndex + 1]]
            }
          }

          console.log(prev, next)
          ctx.body = {
            code: 200,
            result: {
              content: result,
              prev,
              next
            },
            msg: "查询新闻详情成功！"
          };
        })
        .catch(error => {
          ctx.body = {
            code: 401,
            msg: "查询文章详情失败"
          };
        });
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: "服务器异常，请稍后重试！"
      };
    }
  }

  /**
   * @name 按标题模糊查询
   * @param {String} title // 文章ID
   */
  async fuzzyQueryNews(ctx, next) {
    let { title, startTime, endTime, size = 10, page = 1 } = ctx.request.body;
    let options = {
      skip: Number((page - 1) * size),
      limit: Number(size),
      sort: {
        timeNum: -1
      }
    };
    let query = {};
    if (startTime && endTime) {
      if (!($.isFormatDate(startTime) && $.isFormatDate(endTime))) {
        ctx.body = {
          code: 999,
          msg: "日期格式不符合要求"
        };
        return;
      }

      if (+new Date(startTime) > +new Date(endTime)) {
        ctx.body = {
          code: 999,
          msg: "开始时间不能大于结束时间"
        };
        return;
      }

      query["edit_time"] = {
        $gte: startTime,
        $lte: endTime
      };
    }

    try {
      if (title) {
        query["title"] = new RegExp(title);
      }

      let result = await Article.find(query, null, options);
      let total = await result.length;
      ctx.body = {
        code: 200,
        result: {
          result: result,
          pagination: {
            total,
            page: Number(page),
            size: Number(size)
          }
        },
        msg: "查询新闻数据成功"
      };
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: "服务器异常，请稍后重试！"
      };
    }
  }

  /**
   * @name 按时间范围查询
   * @param {String} startTime // 查询开始时间
   * @param {String} endTime // 查询结束时间
   */
  async timeToQuery(ctx, next) {
    let { startTime = "", endTime = "" } = ctx.request.body;

    if (!($.isFormatDate(startTime) && $.isFormatDate(endTime))) {
      ctx.body = {
        code: 999,
        msg: "日期格式不符合要求"
      };
      return;
    }

    if (+new Date(startTime) > +new Date(endTime)) {
      ctx.body = {
        code: 999,
        msg: "开始时间不能大于结束时间"
      };
      return;
    }

    try {
      Article.find({
        edit_time: {
          $gte: startTime,
          $lte: endTime
        }
      })
        .then(res => {
          ctx.body = {
            code: 200,
            result: res,
            msg: "查询新闻数据成功"
          };
        })
        .catch(err => {
          ctx.body = {
            code: 401,
            msg: "搜索新闻数据失败"
          };
        });
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: "服务器异常，请稍后重试！"
      };
    }
  }
}

module.exports = new newsComponent();
