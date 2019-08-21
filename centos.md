## 上汽保险CMS环境搭建

### 所有的环境
> nodejs -> 8.x

> mongodb -> 3.4

> pm2

> nginx

### nodejs环境
 > curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -

 > yum install -y nodejs 

 ### mongodb环境搭建
 ```js
//  创建配置文件
 ```
> vim /etc/yum.repos.d/mongodb-org-3.4.repo

> [mongodb-org-3.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.4/x86_64/
gpgcheck=0
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc

> yum -y install mongodb-org   

#### 安装完成修改配置文件
```js
// 进入配置文件
vi /etc/mongod.conf
// 修改
bindIp: 0.0.0.0 

security:
  authorization: enabled

// 创建超级管理员
> mongo
> use admin
>  db.createUser({user:"admin",pwd:"Pass1234",roles:[{ role: "userAdminAnyDatabase", db: "admin" }]})
> use insaic
db.crateUser({user: "insaic", pwd: "Pass1234", roles: [{ role: "readWrite", db: "insaic" }]})
```

#### 权限说明
--------------------- 
|roles|属性|
|-|-|-|
|readAnyDatabase|任何数据库的只读权限|
|userAdminAnyDatabase|任何数据库的读写权限|
|userAdminAnyDatabase|任何数据库用户的管理权限|
|dbAdminAnyDatabase|任何数据库的管理权限|

### 安装pm2
> npm install -g pm2

### nginx安装
> sudo rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm

> sudo yum install -y nginx 