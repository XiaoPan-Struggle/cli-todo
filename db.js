const homedir = require("os").homedir(); // 不读取环境变量
const home = process.env.HOME || homedir;
const path = require("path");
const dbpath = path.join(home, ".todo");
const fs = require("fs");

/*
* 使用 os 操作系统模块获取到 home文件夹
* 使用 path 路径模块的 join 方法拼接要操作文件的路径
* 使用 fs 模块对文件进行读写操作
* */

// 读写都是异步操作，所以无法 return结果，对其包装一层 Promise，使用 resolve reject回调返回
const db = {
    readFile(path = dbpath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {flag: "a+"}, (error, data) => {
                if (error) return reject(error);
                let taskList;
                try {
                    taskList = JSON.parse(data.toString());
                } catch (err) {
                    taskList = [];
                }
                resolve(taskList);
            });
        });
    },
    writeFile(taskList, path = dbpath) {
        const content = JSON.stringify(taskList);
        return new Promise((resolve, reject) => {
            fs.writeFile(path, content + "\n", (error) => {
                if (error) return reject(error);
                resolve("success add a task")
            });
        })
    }
};

module.exports = db;
