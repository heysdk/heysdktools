/**
 * Created by zhs007 on 15/2/1.
 */

var console = require('console');
var path = require('path');
var fileutils = require('heyutils').fileutils;
var csv2obj = require('heyutils').csv2obj;
var adtprojutils = require('../adtprojutils');
var cocos2dxutils = require('../cocos2dxutils');
var xmlmerge = require('../xmlmerge');

var argv = process.argv.splice(2);

if (argv.length != 1) {
    console.log('please input node revertbaseprojcc3.js proj.csv');

    process.exit(1);
}

var projname = argv[0];

var projconfig = csv2obj.loadCSVSync(projname);

var srcdir = projconfig[0].projpath;
var destdir = projconfig[0].destpath;
var newprojname = projconfig[0].projname;
var projpkg = projconfig[0].projpkg;
var adtworkspace = projconfig[0].adtworkspace;

cocos2dxutils.revertCocos2dxHelloWorldCpp_cc3(destdir);
fileutils.delFileOrDirSync(destdir);