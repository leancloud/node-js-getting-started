const AV = require('leanengine')
const AVO = require('leancloud-storage')
const fs = require('fs')
const path = require('path')

/**
 * 加载 functions 目录下所有的云函数
 */
fs.readdirSync(path.join(__dirname, 'functions')).forEach( file => {
  require(path.join(__dirname, 'functions', file))
})

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request) {
  console.log(request.currentUser)
  return 'Hello world!'
})

console.log(AV._config.serverURLs, AVO._config.serverURLs);