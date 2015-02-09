/**
 * Created by zhs007 on 15/2/7.
 */

var console = require('console');
var path = require('path');
var fileutils = require('heyutils').fileutils;
var csv2obj = require('heyutils').csv2obj;
var cocos2dxutils = require('./cocos2dxutils');
var fs = require('fs');

function proc(projname) {
    var data = fs.readFileSync(projname);
    var projconfig = JSON.parse(data.toString());

    var destdir = projconfig.destprojpath;

    console.log('destdir is ' + destdir);

    cocos2dxutils.revertCocos2dxHelloWorldCpp_cc3(destdir);
    fileutils.delFileOrDirSync(destdir);
}

exports.proc = proc;

console.log('load revertproj...');