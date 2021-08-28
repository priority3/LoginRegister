// 引入Router构造函数
const { Router } = require('express')

// 引入path
const path = require('path')
// 引入express-session
const session = require('express-session')
// 引入cookie解析器
// const cookieParser = require('cookie-parser')
const usersModel = require('../model/users')
const router = new Router()
// router.use(cookieParser())

router.get('/login', (req, res) => {
    // UI
    // let url = path.resolve(__dirname, '../public/login.html')
    // res.sendFile(url)
    // 得到页面的email
    let { email } = req.query
    res.render('login', { errMsg: { email } })
})

router.get('/register', (req, res) => {
    // UI
    // let url = path.resolve(__dirname, '../public/register.html')
    // res.sendFile(url)
    res.render('register', { errMsg: {} })
})

router.get('/user_center', (req, res) => {
    // console.log(req.session)
    const { _id } = req.session
    if (_id) {
        usersModel.findOne({ _id }, (err, data) => {
            if (!err && data) {
                let nick_name = data.nick_name
                res.render('user_center', { nick_name })
            } else {
                res.redirect('http://localhost:3000/login')
            }
        })
    } else {
        res.redirect('http://localhost:3000/login')
    }
})

// 为了符合node对中间件的定义，中间件是一个函数
module.exports = function () {
    return router
}
