// require mongoose
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true) // 警告

const IP = 'localhost'
const PORT = '27017'
const DB_NAME = 'loginRegister' // 连接到的数据库名

function connectMongo(success, failed) {
        mongoose.connect(`mongodb://${IP}:${PORT}/${DB_NAME}`, {
                useNewUrlParser: true, // 用一个新的URL解析器 安全问题
                useUnifiedTopology: true // 使用新的拓扑结构，效率问题
        })


        mongoose.connection.on('open', (err) => {
                if (err) {
                        console.log("未连接到数据库");
                        failed();
                } else {
                        console.log("已成功连接到数据库");
                        success();
                }
        })
}

module.exports = connectMongo