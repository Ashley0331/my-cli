#!/usr/bin/env node
const create = require('../lib/create.ts');
const program = require('commander');
program.version(require('../package.json').version);
program
    .command('create <name>')
    .description('create a new project')
    .action(name => {
        create(name).then(()=>{
            process.exit(); // 创建成功，终止进程
        }).catch(err => {
            console.log(err);
        });
    })
program.parse();