/**
 * Created by zhs007 on 15/2/7.
 */

var console = require('console');
var path = require('path');
var fileutils = require('heyutils').fileutils;
var csv2obj = require('heyutils').csv2obj;
var cocos2dxutils = require('../cocos2dxutils');

function proc(projname) {
    var projconfig = csv2obj.loadCSVSync(projname);
    
    var destdir = projconfig[0].destpath;

    cocos2dxutils.revertCocos2dxHelloWorldCpp_cc3(destdir);
    fileutils.delFileOrDirSync(destdir);
}

exports.proc = proc;