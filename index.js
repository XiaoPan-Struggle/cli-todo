const db = require("./db.js");
const inquirer = require("inquirer");

/*
* db.js 是对文件读写操作的一次封装，暴露出一个 db，面向接口编程
* 使用 inquirer库 对命令行进行结构样式美化
* */

module.exports.add = async (taskTitle) => {
    // 读取之前的任务
    const taskList = await db.readFile();
    // 往里面添加一个任务
    taskList.push({taskTitle: taskTitle, done: false});
    // 存储任务到文件
    await db.writeFile(taskList);
};

module.exports.clear = async () => {
    await db.writeFile([]);
};

module.exports.showAll = async () => {
    let taskList = await db.readFile();
    inquirer
      .prompt({
            type: "list",
            name: "index",
            message: "请选择你想操作的任务",
            choices: [{name: "退出", value: "-1"}, ...taskList.map((task, index) => {
                return {
                    name: `${task.done ? "[✔]" : "[_]"} ${index + 1} - ${task.taskTitle}`,
                    value: index.toString()
                };
            }), {name: "添加任务", value: "-2"}]
        }
      )
      .then(({index}) => {
          let i = parseInt(index);
          if (i >= 0) {
              // 询问接下来操作
              inquirer
                .prompt({
                    type: "list",
                    name: "method",
                    message: "请选择操作",
                    choices: [
                        {name: "退出", value: "exit"},
                        {name: "已完成", value: "finish"},
                        {name: "未完成", value: "undone"},
                        {name: "改标题", value: "update"},
                        {name: "删除", value: "delete"}
                    ]
                })
                .then(({method}) => {
                    switch (method) {
                        case "finish":
                            taskList[index].done = true;
                            db.writeFile(taskList);
                            break;
                        case "undone":
                            taskList[index].done = false;
                            db.writeFile(taskList);
                            break;
                        case "delete":
                            taskList.splice(index, 1);  // splice从index开始删除1个，slice(start, end)从start，截取到end不包含end，split(',')以,切割字符串成数组
                            db.writeFile(taskList);
                            break;
                        case "update":
                            inquirer
                              .prompt({
                                  type: "input",
                                  name: "taskTitle",
                                  message: "输入任务标题"
                              }).then(({taskTitle}) => {
                                taskList[index].taskTitle = taskTitle;
                                db.writeFile(taskList);
                            });
                            break;
                    }
                });
          } else if (i === -2) {
              // 添加
              inquirer
                .prompt({
                    type: "input",
                    name: "taskTitle",
                    message: "输入任务标题"
                }).then(({taskTitle}) => {
                  taskList.push({
                      taskTitle,
                      done: false
                  });
                  db.writeFile(taskList);
              });
          }
      });
};





