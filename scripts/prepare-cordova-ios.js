#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const shell = require('shelljs')
const srcDir = path.join(__dirname, '../public/')
const dstDir = path.join(__dirname, '../cordova/www/')

const htmlSrcDir = path.join(__dirname, '../client/src/cordova/')

// Make sure dstDir exists
try {
  fs.statSync(dstDir)
} catch (e) {
  fs.mkdirSync(dstDir)
}

const paths = [srcDir, htmlSrcDir]

paths.forEach(path => {
  try {
    fs.statSync(srcDir)
  } catch (e) {
    console.error('Path does not exist: ' + srcDir)
    process.exit(2)
  }  
})

let code

// Copy public -> www
code = shell.exec('rsync -ra --exclude="- .*" "' + srcDir + '" "' + dstDir + '"').code

if (code !== 0) {
  console.error('Error occured on copying public. Code: ' + code)
  process.exit(3)
}

// Copy html/cordova -> www
code = shell.exec('rsync -ra --exclude="- .*" "' + htmlSrcDir + '" "' + dstDir + '"').code

if (code !== 0) {
  console.error('Error occured on copying public. Code: ' + code)
  process.exit(3)
}

// shell.exec('cd cordova')
code = shell.exec('cd cordova && cordova prepare ios').code

if (code !== 0) {
  console.error('Error occured on preparing ios public. Code: ' + code)
  process.exit(3)
}

console.log('[Cordova]', 'Platform: ios [x]')
