const inquirer = require("inquirer");
const download = require("download-git-repo"); // 远程拉取模版文件
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const ora = require("ora"); // 加载动画
const handlebars = require('handlebars');


const template = {
  react: {
    url: "https://github.com:Ashley0331/react_template#master",
  },
  vue: {
    url: "https://github.com:Ashley0331/vue_template#master",
  },
};

const config = [
  {
    type: "list",
    name: "type",
    message: "Project Type",
    choices: ["vue", "react"],
  },
  {
    type: "input",
    name: "name",
    message: "Project Name",
    default: "test-template",
  },
  {
    type: 'input',
    name: 'author',
    message: 'author',
    default: 'default value'
  },
  {
    type: 'input',
    name: 'description',
    message: 'description',
    default: 'default value'
  }
];

module.exports = () => {
  const spinner = ora("正在拉取模版...");
  inquirer.prompt(config).then(({ name, type, author, description }) => {
    if (name.length <= 0) {
      console.log("Project name is missing.");
      process.exit();
    }
    spinner.start();
    const url = template[type].url;
    const fullName = process.cwd() + "/" + name;
    if (fs.existsSync(fullName)) {
      // 判断目录是否已经存在
      spinner.fail(chalk.red("目录已存在"));
      process.exit();
    }
    // 模版内容
    const meta = {
      projectName: name,
      author,
      description
    }
    download(url, fullName, { clone: true }, (err) => {
      if (err) {
        spinner.fail(chalk.red("模版创建失败"));
        console.log(err);
      } else {
        // 获取package.json的内容，（模版内容已写入文件中）
        // 使用handlebar进行模版内容替换
        const fileUrl = `${fullName}/package.json`
        const content = fs.readFileSync(fileUrl).toString(); // 获取package.json的文件内容
        const trueContent = handlebars.compile(content)(meta); // 模版内容替换
        fs.writeFileSync(fileUrl, trueContent); // 将替换后的内容写入源文件
        spinner.succeed(chalk.green("模版创建成功"));
      }
    });
  });
};
