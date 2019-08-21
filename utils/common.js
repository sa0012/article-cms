const fs = require("fs");
const path = require("path");

const utils = {
  isMobile: phone => /^1(3|4|5|6|7|8|9)[0-9]\d{8}$/.test(phone),
  isCar: car =>
    /(^(浙|闽|粤|京|津|冀|晋|蒙|辽|吉|黑|沪|苏|皖|赣|鲁|豫|鄂|湘|桂|琼|渝|川|贵|云|藏|陕|甘|青|宁|新){1}[A-Z0-9]{6,7}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(
      car
    ),
  isID: function(ID) {
    // 是否是PRC身份证
    if (typeof ID !== "string") return false;
    var city = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外"
    };
    var birthday =
      ID.substr(6, 4) +
      "/" +
      Number(ID.substr(10, 2)) +
      "/" +
      Number(ID.substr(12, 2));
    var d = new Date(birthday);
    var newBirthday =
      d.getFullYear() +
      "/" +
      Number(d.getMonth() + 1) +
      "/" +
      Number(d.getDate());
    var currentTime = new Date().getTime();
    var time = d.getTime();
    var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var arrCh = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
    var sum = 0;
    var i;
    var residue;
    if (!/^\d{17}(\d|x)$/i.test(ID)) return false;
    if (city[ID.substr(0, 2)] === undefined) return false;
    if (time >= currentTime || birthday !== newBirthday) return false;
    for (i = 0; i < 17; i++) {
      sum += ID.substr(i, 1) * arrInt[i];
    }
    residue = arrCh[sum % 11];
    if (residue !== ID.substr(17, 1)) return false;
    return true;
  },
  isEmail: mail =>
    /^(?=\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$).{0,50}$/.test(mail),
  isChinese: chinese => /^.{1,50}$/.test(chinese),
  isName: name => /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/.test(name),
  isFormatDate: date => {
    if (!date && typeof date !== "string") return;
    // 匹配 2019-07-16 12:02:32 这种日期格式
    return /^\d{4}(-)(1[0-2]|0?[1-9])(-)([0-2]\d|\d|30|31)(\s+)(([01]\d|2[0-3]):[0-5]\d:[0-5]\d)$/.test(
      date
    );
  },
  // 选择当天以及当天以后的日期
  isCurrentDay: date => {
    if (!date && typeof date !== "string" && !this.isFormatDate(date)) return;
    return date.split(" ")[0].split("-");
  },
  /**
   * 获取两个数组之间的不同的部分
   */
  getdifferentArr(arry1, arry2) {
    var arry3 = [];
    var tmp = arry1.concat(arry2);
    var o = {};
    for (let i = 0; i < tmp.length; i++)
      tmp[i] in o ? o[tmp[i]]++ : (o[tmp[i]] = 1);
    for (let x in o) if (o[x] === 1) arry3.push(x);
    return arry3;
  },
  /**
   * 获取两个数组的公共部分
   */
  getSameArr(arry1, arry2) {
    var arry3 = [];
    var j = 0;
    for (var i = 0; i < arry1.length; i++) {
      for (var k = 0; k < arry2.length; k++) {
        if (arry1[i] === arry2[k]) {
          arry3[j] = arry1[i];
          ++j;
        }
      }
    }
    return arry3;
  },
  // 数据归类
  groupBy(arr, prop, callback) {
    var newArr = {},
      tempArr = [];
    for (var i = 0, j = arr.length; i < j; i++) {
      var result = callback(arr[i], arr[i + 1], prop);
      console.log(result, "result");
      if (result) {
        tempArr.push(arr[i]);
      } else {
        tempArr.push(arr[i]);
        // newArr.push(tempArr.slice(0));
        newArr[arr[i][prop].split(" ")[0].split("-")[0]] = tempArr.slice(0);
        tempArr.length = 0;
      }
    }

    return newArr;
  },

  // 统计数组元素的出现频率
  timesOfCount(arr) {
    let result = {};
    for (let index in arr) {
      if (result.hasOwnProperty(arr[index])) {
        let arr1 = arr[index];
        result[arr1] = result[arr1] + 1;
      } else {
        let arr1 = arr[index];
        result[arr1] = 1;
      }
    }

    return result;
  },

  // 从当前时间开始获取连续的12个月份
  twelveMonths(current) {
    if (!current) throw new Error("没有时间参数");
    // 日期统计
    let month = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12"
    ];
    let currentTime = current.split(" ")[0];
    let cYear = currentTime.split("-")[0];
    let cMonth = currentTime.split("-")[1];
    let currentYearArr = month.slice(0, Number(cMonth));
    let nextYearArr = month.slice(Number(cMonth));
    let nextResult = [],
      currentResult = [];
    nextYearArr.forEach((next, nIndex) => {
      nextResult.push(`${cYear - 1}-${next}`);
    });
    currentYearArr.forEach((current, nIndex) => {
      currentResult.push(`${cYear}-${current}`);
    });
    // console.log(currentResult, nextYearArr, 'time')
    return nextResult.concat(currentResult);
  },

  // 检测传入的数据类型是否是数组
  isArray: arr => Object.prototype.toString.call(arr) == "[object Array]",
  // 校验密码
  isPWD: pwd => /[a-zA-Z0-9]{6, 12}/g,

  /**
   * 读取路径信息
   * @param {string} path 路径
   */
  getStat(path) {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        if (err) {
          resolve(false);
        } else {
          resolve(stats);
        }
      });
    });
  },

  /**
   * 创建路径
   * @param {string} dir 路径
   */
  mkdir(dir) {
    return new Promise((resolve, reject) => {
      fs.mkdir(dir, err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  },

  /**
   * 路径是否存在，不存在则创建
   * @param {string} dir 路径
   */
  async dirExists(dir) {
    let isExists = await this.getStat(dir);
    //如果该路径且不是文件，返回true
    if (isExists && isExists.isDirectory()) {
      return true;
    } else if (isExists) {
      //如果该路径存在但是文件，返回false
      return false;
    }
    //如果该路径不存在
    let tempDir = path.parse(dir).dir; //拿到上级路径
    //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    let status = await this.dirExists(tempDir);
    let mkdirStatus;
    if (status) {
      mkdirStatus = await this.mkdir(dir);
    }
    return mkdirStatus;
  },

  // 判断该文件是否存在
  isExistFile(path) {
    return new Promise((resolve, reject) => {
      fs.exists(path, function(exists) {
        console.log(path, exists, "isExistFile");
        if (exists) {
          resolve(exists);
        } else {
          resolve(false);
        }
      });
    });
  },

  // 删除文件
  deleteFile(path) {
    // fs.unlink删除文件
    fs.unlink(path, function(error) {
      if (error) {
        return false;
      }
    });
  }
};

module.exports = utils;
