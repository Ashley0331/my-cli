const inquirer = require("inquirer");
const download = require("download-git-repo"); // 远程拉取模版文件
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const ora = require("ora"); // 加载动画
const handlebars = require("handlebars");
const metalsmith = require("metalsmith");
const rimraf = require('rimraf').sync;

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
    type: "input",
    name: "author",
    message: "author",
    default: "default value",
  },
  {
    type: "input",
    name: "description",
    message: "description",
    default: "default value",
  },
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
    const tempDir = process.cwd() + "/.template"; // 临时文件夹
    if (fs.existsSync(fullName)) {
      // 判断目录是否已经存在
      spinner.fail(chalk.red("目录已存在"));
      process.exit();
    }
    // 模版内容
    const meta = {
      projectName: name,
      author,
      description,
    };
    // 下载到临时文件夹里，进行内容的替换
    download(url, tempDir, { clone: true }, (err) => {
      if (err) {
        spinner.fail(chalk.red("模版创建失败"));
        console.log(err);
      } else {
        const folder = metalsmith(tempDir);
        folder.metadata(meta);
        folder
          .source(tempDir) // 遍历目录
          .destination(fullName) // 目标目录
          .use((files, meta, done) => {
            // 替换内容
            handleContent(files, meta);
            done();
          })
          .build((err) => {
            rimraf(tempDir); // 删除临时目录
            if (err) {
              spinner.fail(chalk.red("项目创建失败"));
              console.log(err);
              process.exit();
            } else {
              spinner.succeed(chalk.green("项目创建成功"));
              process.exit();
            }
          });
      }
    });
  });
};

const handleContent = (files, meta) => {
  // files是对象，key方法获取他的key值数组，遍历文件
  const list = Object.keys(files);
  list.forEach((file) => {
    const content = files[file].contents.toString();
    // 检查文件内容是否含有模版内容
    if (/{{([^{}]+)}}/g.test(content)) {
      // 替换模版内容
      const trueContent = handlebars.compile(content)(meta.metadata());
      // 将新的内容覆盖
      files[file].contents = Buffer.from(trueContent);
    }
  });
};
