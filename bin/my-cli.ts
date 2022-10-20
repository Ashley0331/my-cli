#!/usr/bin/env node
const create = require('../lib/create.ts');
const program = require('commander');
program.version(require('../package.json').version);
program
    .command('create')
    .description('create a new project')
    .action(() => {
        create();
    })
program.parse();