var log4js = require("./log_config");

var errorLog = log4js.getLogger("errorLog");
var resLog = log4js.getLogger("responseLog");

var log = {};
log.i = function(ctx, resTime) {
  if (ctx) {
    resLog.info(formatRes(ctx, resTime));
  }
};

log.e = function(ctx, error, resTime) {
  console.log(error, 'error')
  if (ctx && error) {
    errorLog.error(formatError(ctx, error, resTime));
  }
};

//格式化请求日志
var formatReqLog = function(req, resTime) {
  var logText = {};
  var request = null;
  //访问方法
  var method = req.request.method;
  logText.request_method = method;
  //请求原始地址
  logText.request_originalUrl = req.request.originalUrl;
  let getClientIp = function(req) {
    return (
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress ||
      ""
    );
  };
  try {
    let ip = getClientIp(req.request).match(/\d+.\d+.\d+.\d+/);

    //客户端ip
    logText.request_client_ip = ip;
  } catch (e) {
  }

  //服务器响应时间
  logText.response_time = resTime;

  //请求参数
  if (method === "GET") {
    request = req.request.query;
  } else {
    request = req.request.body;
  }

  return {
    request_body: request,
    response: logText
  }
};

//格式化响应日志
var formatRes = function(res, resTime) {
  var logText = {};

  //添加请求日志
  logText = Object.assign({}, formatReqLog(res, resTime).response || {});
  //响应状态码
  logText.response_status = res.res.statusCode;


  //响应内容
  var response_body = res.body;

  return JSON.stringify(logText) + ' - ' + (JSON.stringify(formatReqLog(res, resTime).request_body) || '') + ' - ' + JSON.stringify(response_body);
};

//格式化错误日志
var formatError = function(res, err, resTime) {
  var logText = {};

  //添加请求日志
  logText = Object.assign({}, formatReqLog(res, resTime).response || {});

  //错误名称
  logText.err_name = err.name;
  //错误信息
  logText.err_message = err.message;
  //错误详情
  logText.err_stack = err.stack;

  return JSON.stringify(logText) + ' - ' + (JSON.stringify(formatReqLog(res, resTime).request_body) || '');
};

module.exports = log;
