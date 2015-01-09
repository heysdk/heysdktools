/**
 * Created by zhs007 on 2015/1/9.
 */

var console = require('console');
var path = require('path');
var fileutils = require('../fileutils');
var csv2obj = require('../csv2obj');
var adtprojutils = require('../adtprojutils');
var cocos2dxutils = require('../cocos2dxutils');
var xmlmerge = require('../xmlmerge');

var argv = process.argv.splice(2);

if (argv.length != 1) {
    console.log('please input node makebaseproj-cc3.js proj.csv');

    process.exit(1);
}

var projname = argv[0];

var projconfig = csv2obj.loadCSVSync(projname);

var srcdir = projconfig[0].projpath;
var destdir = projconfig[0].destpath;
var newprojname = projconfig[0].projname;
var projpkg = projconfig[0].projpkg;

console.log('src proj is ' + srcdir);
console.log('dest proj is ' + destdir);
console.log('dest proj name is ' + newprojname);
console.log('dest proj pkg is ' + projpkg);

fileutils.copyFileOrDir(srcdir, destdir, function () {
    console.log('copy end.');

    var xmlobj = adtprojutils.loadProjXML(destdir);

    adtprojutils.chgProjName(xmlobj, newprojname);
    adtprojutils.addLinkedResources(xmlobj, 'heysdkjava', '$%7BPARENT-1-PROJECT_LOC%7D/heysdk/heysdkjava/src');
    adtprojutils.addLinkedResources(xmlobj, 'heysdk-cocos2dx', '$%7BPARENT-1-PROJECT_LOC%7D/heysdk/heysdkjava/plugins/cocos2dx');
    adtprojutils.addLinkedResources(xmlobj, 'heysdk-kuaiwan', '$%7BPARENT-1-PROJECT_LOC%7D/heysdk/heysdkjava/plugins/kuaiwan');
    //adtprojutils.removeProject(xmlobj, 'libcocos2dx');

    adtprojutils.saveProjXML(destdir, xmlobj);

    xmlobj = adtprojutils.loadClassPathXML(destdir);
    adtprojutils.addClassPath(xmlobj, 'heysdkjava');
    adtprojutils.addClassPath(xmlobj, 'heysdk-cocos2dx');
    adtprojutils.addClassPath(xmlobj, 'heysdk-kuaiwan');

    adtprojutils.saveClassPathXML(destdir, xmlobj);

    var mkinfo = '#<--heysdk\r\n';
    mkinfo += 'LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../heysdk/heysdkcpp\r\n';
    mkinfo += 'LOCAL_WHOLE_STATIC_LIBRARIES += libheysdk_static\r\n';
    mkinfo += '$(call import-add-path,$(LOCAL_PATH)/../../)\r\n';
    mkinfo += '$(call import-module,heysdk/prebuild/android-cc3)\r\n';
    mkinfo += '#-->\r\n';

    adtprojutils.insAndroidMK(destdir, mkinfo);

    cocos2dxutils.chgCocos2dxActivityEx(destdir);

    var amxmlfile1 = path.join(destdir, 'AndroidManifest.xml');
    var amxmlfile2 = path.join('../core/projjava/heysdkbase', 'AndroidManifest.xml');
    xmlmerge.mergeWithFile(amxmlfile1, amxmlfile2, amxmlfile1, 'AndroidManifest.csv', function () {

    });
});