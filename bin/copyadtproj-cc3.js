/**
 * Created by zhs007 on 2015/1/8.
 */

var exec = require('../exec');
var fileutils = require('../fileutils');
var arrutils = require('../arrutils');
var adtprojutils = require('../adtprojutils');
var cocos2dxutils = require('../cocos2dxutils');
var fs = require('fs');
var path = require('path');
var console = require('console');
var xmlmerge = require('../xmlmerge');

var argv = process.argv.splice(2);

if (argv.length != 3) {
    console.log('please input node clearadtproj.js srcdir destdir newprojname');

    process.exit(1);
}

var srcdir = argv[0];
var destdir = argv[1];
var newprojname = argv[2];

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