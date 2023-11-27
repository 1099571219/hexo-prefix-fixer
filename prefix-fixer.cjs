const fs = require("fs");
const path = require("path");
const postPath = (cmd, root) => [root.split(cmd), __dirname.split(cmd).pop()]
const getRootDirName = (root) => {
    /**@type {Array} */
    let pathNodeArr
    /**@type {String} */
    let rootDirName
    if (root.indexOf('/') >= 0) {
        [pathNodeArr, rootDirName] = postPath('/', root)
    } else if (root.indexOf('\\') >= 0) {
        [pathNodeArr, rootDirName] = postPath('\\', root)
    }
    const rootIndex = pathNodeArr.indexOf(rootDirName)
    return pathNodeArr.splice(rootIndex)
}
const addPrefix = (filePath, fileName, root, gSubTitle, gTime) => {
    const val = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const title = fileName.split('.')[0]
    const rootDirName = getRootDirName(root)
    const subTitle = gSubTitle ? '# ' + title : ''
    const time = gTime ? `
date: ${gTime}` : ''
    const prefix = `---
title: ${title}
categories: 
- [${rootDirName}]
tag: ${rootDirName[rootDirName.length - 1]}${time}
---
${subTitle}`
    if (val.startsWith(prefix)) {
        console.log('已经添加,开始抹除', filePath);
        console.log(prefix);
        const resetVal = val.substring(prefix.length);
        fs.writeFileSync(filePath, resetVal)
    } else {
        console.log('开始添加', filePath);
        console.log(prefix);
        fs.writeFileSync(filePath, prefix + val)
    }
}
//gSubTitle 是否生成文章内容一级标题
//gTime 格式： xxxx-xx-xx  比如 2023-11-24
const readDir = (gSubTitle = false, gTime = false, root = __dirname) => {
    const dirs = fs.readdirSync(path.resolve(root))
    for (let i = 0; i < dirs.length; i++) {
        if (dirs[i] === 'README.md') continue
        const curFilePath = path.resolve(root, './' + dirs[i])
        const cur = fs.statSync(curFilePath)
        cur.isDirectory() ? readDir(gSubTitle, gTime, curFilePath) : dirs[i].endsWith('.md') && addPrefix(curFilePath, dirs[i], root, gSubTitle, gTime)
    }
    return
}

// readDir(false,'2023-11-24')
readDir()