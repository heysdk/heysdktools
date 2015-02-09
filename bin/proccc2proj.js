/**
 * Created by zhs007 on 2015/1/15.
 */

// cocos2dx 2.x 项目，一般建立的时候不能直接使用的，需要手动调一下配置
// 特别是ADT下，有很多绝对路径，本工具就是帮助自动调整项目的



var console = require('console');
var path = require('path');
var fileutils = require('heyutils').fileutils;
var csv2obj = require('heyutils').csv2obj;
var adtprojutils = require('../adtprojutils');
var cocos2dxutils = require('../cocos2dxutils');
var xmlmerge = require('../xmlmerge');
var timeutils = require('heyutils').timeutils;

var argv = process.argv.splice(2);

if (argv.length != 1) {
    console.log('please input node proccc2proj.js proj.csv');

    process.exit(1);
}

var csvname = argv[0];

var projconfig = csv2obj.loadCSVSync(csvname);

var projdir = projconfig[0].projpath;
var ndkdir = projconfig[0].ndkpath;

console.log('proj is ' + projdir);
console.log('NDK_ROOT is ' + ndkdir);

var adtprojfile = path.join(projdir, 'proj.android/.project');
var bk_adtprojfile = adtprojfile + '.' + timeutils.getNowString('YYYYMMDD');
fileutils.copyfile(adtprojfile, bk_adtprojfile, function () {
    var adtprojdir = path.join(projdir, 'proj.android');

    var xmlobj = adtprojutils.loadProjXML(adtprojdir);
    adtprojutils.addLinkedResources(xmlobj, 'libcocos2d', '$%7BPARENT-3-PROJECT_LOC%7D/cocos2dx/platform/android/java/src');
    adtprojutils.chgLinkedResources(xmlobj, 'Classes', '$%7BPARENT-1-PROJECT_LOC%7D/Classes');
    adtprojutils.chgLinkedResources(xmlobj, 'cocos2dx', '$%7BPARENT-3-PROJECT_LOC%7D/cocos2dx');
    adtprojutils.chgLinkedResources(xmlobj, 'extensions', '$%7BPARENT-3-PROJECT_LOC%7D/extensions');
    adtprojutils.chgLinkedResources(xmlobj, 'scripting', '$%7BPARENT-3-PROJECT_LOC%7D/scripting');
    adtprojutils.saveProjXML(adtprojdir, xmlobj);

    xmlobj = adtprojutils.loadClassPathXML(adtprojdir);
    adtprojutils.addClassPath(xmlobj, 'libcocos2d');
    adtprojutils.saveClassPathXML(adtprojdir, xmlobj);

    cocos2dxutils.fixCocos2dx2JNI(projdir);
    cocos2dxutils.fixCocos2dx2BuildCmd(projdir);
});