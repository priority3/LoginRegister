const mongoose = require('mongoose')

const Schema = mongoose.Schema


let usersSchema = new Schema({
        "email": {
                type: String,
                uniqe: true, // 唯一性
                require: true // 必填
        },
        "nick_name": {
                type: String,
                require: true // 必填
        },
        "password": {
                type: String,
                require: true // 必填
        },
        "date": {
                type: Date,
                default: Date.now()
        },
        "enable_flag": {
                type: String, // 可用的标识符
                default: 'Y'
        }
})

let usersModel = mongoose.model('users', usersSchema)
//  users为数据库里的定义的集合名

module.exports = usersModel