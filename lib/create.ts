const inquirer = require('inquirer');
const download = require('download-git-repo'); // 远程拉取模版文件
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const ora = require('ora'); // 加载动画

const template = {
    'react': {
        url: 'https://github.com:aiyuekuang/react_home#master'
    },
    "vue": {
        url: 'https://github.com:aiyuekuang/vue_home#master'
    }
}

const config = [
    {
        type: 'list',
        name: 'type',
        message: 'Project Type',
        choices: ['vue','react']
    },
    {
        type:'input',
        name:'name',
        message:'Project Name',
        default: 'cli-test'
    }
]

module.exports = () => {
    const spinner = ora('正在拉取模版...');
    inquirer.prompt(config).then(({ name, type }) => {
        if (name.length <= 0) {
            console.log('Project name is missing.');
            process.exit();
        }
        spinner.start();
        const url = template[type].url;
        const fullName = process.cwd() + '/' + name;
        if(fs.existsSync(fullName)){ // 判断目录是否已经存在
            spinner.fail(chalk.red('目录已存在'));
            process.exit();
        }
        download(url, fullName, { clone: true } ,(err) => {
            if(err){
                spinner.fail(chalk.red('模版创建失败'))
                console.log(err)
            }else{
                spinner.succeed(chalk.green('模版创建成功'));
            }
        })

    })
}