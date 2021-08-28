// 引入模型对象
const usersModel = require('../model/users')

const { Router } = require('express')
const md5 = require('md5')

const router = new Router()

// 处理用户的注册请求，--业务路由
router.post('/register', (req, res) => {
    const { email, nick_name, password, re_password } = req.body
    // console.log(typeof (password), typeof (re_password));
    console.log(req.body)
    /**
     * 思路：
     * 检验合法性：
     *      1. 合法： 去数据库查找该邮箱是否注册过
     *              若已注册，则提示改邮箱已被注册
     *              否则，写入数据库
     *      2. 非法
     *              提示用户输入的个数不准确
     */

    // 正则表达式
    // 匹配邮箱
    const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    // 匹配昵称
    const nickNameReg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/ // 中文、英文、数字包括下划线
    // 匹配密码
    const passwordReg = /^[a-zA-Z]\w{5,17}$/ //密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)

    // 优化 对用户输入错误的格式 在页面输入框后显示正确的输入格式
    const errMsg = {}
    if (!emailReg.test(email)) {
        // 邮箱不合法
        // alert('输入的邮箱不合法，请重新输入')
        // res.send('输入的邮箱不合法，请重新输入')
        errMsg.email = '输入的邮箱不合法，请重新输入'
    }
    if (!nickNameReg.test(nick_name)) {
        errMsg.nickName = '昵称只能为中文、英文、数字和下划线'
    }
    if (!passwordReg.test(password)) {
        errMsg.password =
            '密码格式错误(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)'
        // res.send('输入的密码不合法，请重新输入')
    }
    if (re_password != password) {
        // res.send('两次输入的密码不一致，请重新输入')
        errMsg.re_password = '两次密码不一致'
    }
    // 添加判断 是否包含错误信息，如果含有错误信息，则通过ejs重新把错误信息加上渲染注册页面
    if (JSON.stringify(errMsg) !== '{}') {
        res.render('register', { errMsg })
        return
    }

    // 合法 检查数据库是否含有相同的邮箱
    usersModel.findOne(
        {
            email,
        },
        (err, data) => {
            if (data) {
                // 可以添加计数 达到某个阈值杜绝访问
                // 添加到errMsg当中并且渲染到登录页面当中
                // res.send('该邮箱已被注册过了,请更换邮箱');
                errMsg.email = '该邮箱已被注册过了,请更换邮箱'
                res.render('register', { errMsg })
                return
            }
            // 添加到数据库当中
            usersModel.create(
                {
                    email,
                    nick_name,
                    password: md5(password),
                },
                (err, data) => {
                    if (!err) {
                        console.log(email + '注册成功')
                        // 注册成功跳转到登录页面，并且将登录的邮箱带给login页面
                        // res.send('注册成功');
                        res.redirect(`/login/?email=${email}`)
                    } else {
                        // console.log(err);
                        // 将网络错误渲染出去
                        // res.send('您当前的网络不稳定，请稍后重试.');
                        errMsg.networkErr = '您当前的网络不稳定，请稍后重试.'
                        res.render('register', { errMsg })
                    }
                }
            )
        }
    )
})
//处理用户的登录请求，--业务路由
router.post('/login', (req, res) => {
    // 得到请求的email，pasword 去数据库当中查找
    // 若符合则登录成功 否则登录失败
    let { email, password } = req.body
    // 检查合法性
    const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    const paswordReg = /^[a-zA-Z]\w{5,17}$/ //密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)
    const errMsg = {}
    if (!emailReg.test(email)) {
        // 邮箱不合法
        // alert('输入的邮箱不合法，请重新输入')
        // res.send('输入的邮箱不合法，请重新输入')
        errMsg.emailErr = '输入的邮箱不合法，请重新输入'
    }
    if (!paswordReg.test(password)) {
        // res.send('输入的密码不合法，请重新输入')
        errMsg.password =
            '密码格式不正确(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)'
    }
    if (JSON.stringify(errMsg) !== '{}') {
        // 渲染错误的登录页面
        res.render('login', { errMsg })
        return
    }

    // 合法，开始匹配数据库当中的内容是否匹配
    usersModel.findOne(
        {
            email,
            password: md5(password),
        },
        (err, data) => {
            // console.log(err, data)
            if (err) {
                // err指与数据库交互是否错误
                console.log(err)
                // res.send('网络不稳定，请稍后重试')
                errMsg.networkErr = '网络不稳定，请稍后重试'
                res.render('login', { errMsg })
                return
            }
            if (data) {
                // 登录成功 跳转到百度页面
                // res.redirect('https://www.baidu.com')
                // 传个cookie
                // res.cookie('_id', data._id, { maxAge: 1000 * 30 })
                req.session._id = data._id.toString()
                res.redirect('http://localhost:3000/user_center')
                return
            }
            // res.send('账号或密码错误')
            errMsg.loginErr = '账号或密码错误'
            res.render('login', { errMsg })
        }
    )
})

module.exports = function () {
    return router
}
