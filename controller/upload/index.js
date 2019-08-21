const fs = require("fs");
const $ = require("../../utils/common");

class UploadComponent {
  /**
   * 单张图片上传
   * @param {*} ctx
   * @param {*} next
   */
  async uploadSingleImg(ctx, next) {
    const host = ctx.request.origin;
    let uploadDir = "public/upload/";
    // 获取上传文件
    const files = ctx.request.files.file;
    try {
      // 判断是否存在该静态目录， 不存在则创建
      await $.dirExists("./public/upload");
      let upload = new Promise((resolve, reject) => {
        let filename = files.name;
        // 生成新的图片名
        let avatarName = Date.now() + "_" + filename;
        // 创建可读流
        let readStream = fs.createReadStream(files.path);
        // 创建可写流
        let writeStream = fs.createWriteStream(uploadDir + avatarName);
        // 可读流通过管道写入可写流
        readStream.pipe(writeStream);
        // 上传成功后将图片路径存入数据库
        // host = host.indexOf('http') !== -1 || host.indexOf('https') !== -1 ? host : 
        let url = host + "/" + "upload/" + avatarName;

        // 上传成功后将图片URL保存到数据库中
        // new UploadImg({
        //   url
        // }).save();

        resolve({
          url
        });
      }).catch(err => {
        ctx.body = {
          code: 999,
          msg: "图片上传失败"
        };
      });
      let imageData = await upload;
      ctx.body = {
        code: 200,
        msg: "图片上传成功",
        result: imageData
      };
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: "服务器异常，请稍后重新！"
      };
    }
  }

  /**
   * @name 删除图片
   * @param {*} ctx 
   * @param {*} next 
   * @param {String} poster 图片链接 
   */
  async deleteImg (ctx, next) {
    const { poster } = ctx.request.body;
    let fileName = path.basename(poster);
    let queryPath = "public/upload/" + fileName;
    try {
      $.isExistFile(queryPath).then(async res => {
        if (res) {
          await $.deleteFile(queryPath);
          Article.update({
            poster
          }, {
            poster: ''
          }, {
            new: true
          })
          ctx.body = {
            code: 200,
            msg: '删除图片成功'
          }
        }
      });
    } catch (e) {
      throw new Error("delete error");
    }
  }

  async uploadManyImg(ctx, next) {
    try {
      // 上传多个文件
      const files = ctx.request.files; // 获取上传文件
      // 判断是否存在该静态目录， 不存在则创建
      await $.dirExists("./public/upload");
      let imgArr = [];
      let uploadArr = new Promise((resolve, reject) => {
        console.log(files, 11111)
        // let filename = file.name;
          // // 生成新的图片名
          // let avatarName = Date.now() + "_" + filename;
          // // 创建可读流
          // let readStream = fs.createReadStream(file.path);
          // // 创建可写流
          // let writeStream = fs.createWriteStream(uploadDir + avatarName);
          // // 可读流通过管道写入可写流
          // readStream.pipe(writeStream);
          // // 上传成功后将图片路径存入数据库
          // let url = "http://10.118.14.11:8008" + "/" + "upload/" + avatarName;
          // console.log(avatarName, 'avatarName')
          // imgArr.push(url);
        resolve({
          imgArr
        })
      }).catch(err => {
        console.log('error')
        ctx.body = {
          code: 999,
          msg: "图片上传失败"
        };
      });

      let imageData = await uploadArr;
      console.log(imageData, 'imageData')
      ctx.body = {
        code: 200,
        msg: "图片上传成功",
        result: imageData
      };
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: "服务器异常，请稍后重新！"
      };
    }
  }
}

module.exports = new UploadComponent();
