const {program} = require("commander");
const api = require("./index.js");

/*
* 使用 commander库 注册指令
* */

program
  .option("-x, --xxx", "what the x");

program
  .command("add <taskName>")
  .description("add a task")
  .action((taskName) => {
      api.add(taskName).then(() => {
          console.log("success add a task");
      });
  });

program
  .command("clear")
  .description("clear all task")
  .action(() => {
      api.clear().then(() => {
          console.log("success clear all task");
      });
  });

program
  .command("tasks")
  .description("get all task")
  .action(() => {
      void api.showAll();
  });

program.parse(process.argv);
