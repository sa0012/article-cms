const mongoose = require('mongoose');
const moment = require('moment');
// mongodb://insaic:Pass1234@0.0.0.0:27017/insaic
mongoose.connect("mongodb://0.0.0.0:27017/insaic", {
  useNewUrlParser: true
}, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log("Connection success!")
  }
});

mongoose.set('useCreateIndex', true);

let Schema = mongoose.Schema;

let userSchema = new Schema({
  id: String,
  // 用户名
  user_name: String,
  // 用户密码
  user_pwd: String,
  // 用户创建时间
  create_time: {
    type: String,
    default: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  },
  edit_time: {
    type: String,
    default: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  }
});

// 新闻
let articleSchema = new Schema({
  id: String,
  // 标题
  title: String,
  // 摘要
  summary: String,
  // 内容
  content: '',
  // 文章封面
  poster: '',
  // 发布时间
  create_time: {
    type: String,
    default: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  },
  // 是否发布 "PUBLISH" => 发布， "" => 草稿
  note_type: String,
  edit_time: {
    type: String,
    default: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  },
  timeNum: {
    type: Number,
    default: Date.now
  },
  // 浏览次数
  browser_count: {
    type: Number,
    default: 0
  }
});

// 图片
let uploadSchema = new Schema({
  id: String,
  create_time: {
    type: String,
    default: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  },
  edit_time: {
    type: String,
    default: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  },
  url: {
    type: String,
    default: ''
  }
})


// 文章表
exports.Article = mongoose.model('Article', articleSchema);
exports.User = mongoose.model('User', userSchema);
exports.UploadImg = mongoose.model('UploadImg', uploadSchema);