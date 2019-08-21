// if (process.env.NODE_ENV === "development") {
//   const easyMonitor = require("easy-monitor");
//   easyMonitor("insaic-monitor");
// }
const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const onerror = require("koa-onerror");
const koaBody = require("koa-body");
const log = require("./logger");
// cors
var cors = require('koa2-cors');
// routes
const route = require("./routes/index");
// token
const { checkToken } = require("./middleware/token");

// error handler
onerror(app);

app.use(cors({
  origin: function(ctx) {
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// middlewares
app.use(
  koaBody({
    enableTypes: ["json", "form", "text"],
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
    }
  })
);
app.use(json());
app.use(require("koa-static")(__dirname + "/public"));

// 添加token 验证中间件
app.use(checkToken);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  try {
    await next();
    const ms = new Date() - start
    log.i(ctx, ms);
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  } catch (e) {
    //记录异常日志
    log.e(ctx, e, new Date() - start);
  }
});

app.use(route.routes(), route.allowedMethods());

// error-handling
app.on("error", async (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
