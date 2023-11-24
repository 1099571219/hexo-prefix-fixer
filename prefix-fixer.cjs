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
const addPrefix = (filePath, fileName, root, gTitle) => {
    const val = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const title = fileName.split('.')[0]
    const rootDirName = getRootDirName(root)
    const subTitle = gTitle ? '# ' + title : ''
    const prefix = `---
title: ${title}
categories: 
- [${rootDirName}]
tag: ${rootDirName[rootDirName.length - 1]}
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
//gTitle 是否生成文章内容一级标题
const readDir = (gTitle = false, root = __dirname) => {
    const dirs = fs.readdirSync(path.resolve(root))
    for (let i = 0; i < dirs.length; i++) {
        const curFilePath = path.resolve(root, './' + dirs[i])
        const cur = fs.statSync(curFilePath)
        cur.isDirectory() ? readDir(gTitle, curFilePath) : dirs[i].endsWith('.md') && addPrefix(curFilePath, dirs[i], root, gTitle)
    }
    return
}
readDir(true)