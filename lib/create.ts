const download = require('download-git-repo'); // 远程拉取模版文件
const path = require('path');
module.exports = (name) => {
    return new Promise((resolve, reject) => {
        const fullName = process.cwd() + "/" + name; // 获取文件路径
        const url = 'https://github.com:aiyuekuang/react_home#master'; // github随便找的模版文件
        download(url, fullName, {clone: true}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve('创建成功!');
            }
        })
    })
}