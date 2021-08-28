// require express
const express = require('express')

// require mongoose
// const mongoose = require('mongoose');

let connectMongo = require('./conectDB/connect')

// // 引入模型对象
// let usersModel = require('./model/users')

// 引入路由
let UIRouter = require('./router/UIRouter')
let loginRegisterRouter = require('./router/loginRegisterRouter')

// 链接服务器
let app = express()
app.disable('x-powered-by')
// 引入express-session
const session = require('express-session')
// 引入session持久化
const MongoStore = require('connect-mongo')
app.use(
    session({
        name: 'userid', // 用于显示给客户端cookie的key
        secret: 'secret', // 参与加密的字符串
        saveUninitialized: false, // 是否在存储内容之前创建session会话
        resave: true, // 是否在每次请求时，强制重新保存session，即使没有变化（比较保险）
        store: MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/session_container',
            touchAfter: 24 * 3600, // 修改更新的频率
        }),
        cookie: {
            httpOnly: true, // 开启后前端无法通过js更改cookie
            maxAge: 60 * 1000, // 设置cookie的过期时间，
        },
    })
)

// 引入加密md5
const md5 = require('md5')

//  引入ejs模块
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

// 禁止服务器显示服务器用的是express框架
app.use(
    express.urlencoded({
        extended: true,
    })
) // 解析post请求的urlencode参数
app.use(express.static(__dirname + '/public'))
// 将public当中的静态资源，暴露出去，即可以直接通过.html访问页面，但拿到的是get请求

connectMongo(
    () => {
        app.use(UIRouter())
        app.use(loginRegisterRouter())

        app.listen(3000, (err, data) => {
            if (err) {
                console.log('服务器链接失败', err)
            } else {
                console.log('3000端口链接成功')
            }
        })
    },
    (err) => {
        console.log('数据库链接失败', err)
    }
)
