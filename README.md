### 接口文档

```js
// 注册接口
/web-api/user/register
  request: {
    user_name(String),
    user_pwd(String),
    re_user_pwd(String)
  }

  response: {
    _id, // 用户ID
    user_name, // 用户名
    token, // token
  }
```

```js
// 登陆接口
/web-api/user/signIn
  request: {
    user_name(String),
    user_pwd(String)
  }

  response: {
    _id, // 用户ID
    user_name, // 用户名
    token, // token
  }
```

```js
  // 新闻草稿保存
  /web-api/news/saveContent
  request: {
    article_id(String), // 文章ID， 没有值传空字符
    title(String), // 标题
    summary(String), // 摘要
    content(String), // 文章内容
    poster(url), // 文章封面
    create_time(String) // 发布时间（2019-07-22 12:20:45）
  }

  response: {
    _id, // 文章ID
    title(String), // 标题
    summary(String), // 摘要
    content(String), // 文章内容
    poster(url), // 文章封面
    create_time(String) // 发布时间（2019-07-22 12:20:45）
  }
```

```js
  // 新闻发布
  /web-api/news/publishNews
  request: {
    article_id(String), // 文章ID
    title(String), // 标题
    summary(String), // 摘要
    content(String), // 文章内容
    poster(url), // 文章封面
    create_time(String) // 发布时间（2019-07-22 12:20:45）
  }

  response: {
    _id, // 文章ID
    title(String), // 标题
    summary(String), // 摘要
    content(String), // 文章内容
    poster(url), // 文章封面
    create_time(String) // 发布时间（2019-07-22 12:20:45）
  }
```

```js
  // 新闻草稿保存
  /web-api/news/queryDraft => GET

  response: {
    "code": 200,
    "result": [
        {
            "create_time": "2019-08-13 9:03:46",
            "edit_time": "2019-08-13 9:03:46",
            "browser_count": 0,
            "_id": "5d520b501b3a2f31e4476704",
            "title": "测试123",
            "summary": "摘要测试222",
            "content": "内容测试222",
            "poster": "http://10.118.22.173:8008/upload/1565594031154_car2.jpg",
            "note_type": "DRAFT",
            "__v": 0
        }
    ],
    "msg": "查询草稿数据成功"
}
```

```js
// 修改新闻
 /web-api/news/updateNews

 request: {
   _id, // 文章ID
  title(String), // 标题
  summary(String), // 摘要
  content(String), // 文章内容
  poster(url), // 文章封面
  create_time(String) // 发布时间（2019-07-22 12:20:45）
 }

 response: {
  _id, // 文章ID
  title(String), // 标题
  summary(String), // 摘要
  content(String), // 文章内容
  poster(url), // 文章封面
  create_time(String) // 发布时间（2019-07-22 12:20:45）
}
```

```js
 // 删除新闻
 /web-api/news/deleteNews

 request: {
   _id
 }

 response: {}

```

```js
// 查询所有的新闻数据
 /web-api/news/queryAllNews

 request: {
   size = 10, // 每页请求数量
   page = 1 // 当前页
 }

 response: {
   code: 200,
    msg: "获取新闻数据成功！",
    result: {
      result: [
        {
          _id, // 文章ID
          title(String), // 标题
          summary(String), // 摘要
          content(String), // 文章内容
          poster(url), // 文章封面
          create_time(String) // 发布时间（2019-07-22 12:20:45）
        }
      ],
      pagination: {
        total, // 总页数
        page: Number(page),
        size: Number(size)
      }
    }
 }

```

```js
// 查询新闻详情
 /web-api/news/newsDetails

request: {
  _id
}

response: {
  code: 200,
  result: {
    content: {
      _id, // 文章ID
      title(String), // 标题
      summary(String), // 摘要
      content(String), // 文章内容
      poster(url), // 文章封面
      create_time(String) // 发布时间（2019-07-22 12:20:45）
    },
    prev, // 上一篇文章
    next // 下一篇文章
  },
  msg: "查询新闻详情成功！"
}
```

```js
 // 按标题模糊查询
 /web-api/news/fuzzyQueryNews

 request: {
   title
 }

 response: {
  code: 200,
  result: [
    {
      _id, // 文章ID
      title(String), // 标题
      summary(String), // 摘要
      content(String), // 文章内容
      poster(url), // 文章封面
      create_time(String) // 发布时间（2019-07-22 12:20:45）
    }
  ],
  msg: "查询新闻数据成功"
}

```

```js
// 按时间范围查询
/web-api/news/timeToQuery

requst: {
  startTime = "", // 开始时间
  endTime = "" // 结束时间
}

response: {
  code: 200,
  result: [
    {
      _id, // 文章ID
      title(String), // 标题
      summary(String), // 摘要
      content(String), // 文章内容
      poster(url), // 文章封面
      create_time(String) // 发布时间（2019-07-22 12:20:45）
    }
  ],
  msg: "查询新闻数据成功"
}

```

```js
// 图片上传
/web-api/upload/uploadSingleImg
```
