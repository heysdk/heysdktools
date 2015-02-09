/**
 * Created by zhs007 on 15/2/7.
 */

var console = require('console');
var path = require('path');
var fileutils = require('heyutils').fileutils;
var csv2obj = require('heyutils').csv2obj;
var adtprojutils = require('./adtprojutils');
var cocos2dxutils = require('./cocos2dxutils');
var xmlmerge = require('./xmlmerge');
var fs = require('fs');

function proc(projname) {
    var data = fs.readFileSync(projname);
    var projconfig = JSON.parse(data.toString());

    var srcdir = projconfig.projpath;
    var destdir = projconfig.destprojpath;
    var newprojname = projconfig.destprojname;
    var projpkg = projconfig.destpkgname;

    console.log('src proj is ' + srcdir);
    console.log('dest proj is ' + destdir);
    console.log('dest proj name is ' + newprojname);
    console.log('dest proj pkg is ' + projpkg);

    fileutils.copyFileOrDir(srcdir, destdir, function (srcpath, destpath, isok) {
        if (srcpath != srcdir || destpath != destdir) {
            return ;
        }
        
        console.log('copy proj end.');

        var xmlobj = adtprojutils.loadProjXML(destdir);

        adtprojutils.chgProjName(xmlobj, newprojname);
        adtprojutils.addLinkedResources(xmlobj, 'heysdkjava', '$%7BPARENT-1-PROJECT_LOC%7D/heysdk/heysdkjava/src');
        adtprojutils.addLinkedResources(xmlobj, 'heysdk-cocos2dx', '$%7BPARENT-1-PROJECT_LOC%7D/heysdk/heysdkjava/plugins/cocos2dx');
        adtprojutils.addLinkedResources(xmlobj, 'heysdkcpp', '$%7BPARENT-1-PROJECT_LOC%7D/heysdk/heysdkcpp');
        //adtprojutils.addLinkedResources(xmlobj, 'heysdk-kuaiwan', '$%7BPARENT-1-PROJECT_LOC%7D/heysdk/heysdkjava/plugins/kuaiwan');
        //adtprojutils.removeProject(xmlobj, 'libcocos2dx');

        adtprojutils.saveProjXML(destdir, xmlobj);

        xmlobj = adtprojutils.loadClassPathXML(destdir);
        adtprojutils.addClassPath(xmlobj, 'heysdkjava');
        adtprojutils.addClassPath(xmlobj, 'heysdk-cocos2dx');
        //adtprojutils.addClassPath(xmlobj, 'heysdk-kuaiwan');

        adtprojutils.saveClassPathXML(destdir, xmlobj);

        var mkinfo1 = '#<--heysdk\r\n';
        mkinfo1 += 'LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../heysdk/heysdkcpp\r\n';
        mkinfo1 += 'LOCAL_WHOLE_STATIC_LIBRARIES += libheysdkcpp_static\r\n';
        mkinfo1 += '#-->\r\n';

        var mkinfo2 = '#<--heysdk\r\n';
        mkinfo2 += '$(call import-add-path,$(LOCAL_PATH)/../../)\r\n';
        mkinfo2 += '$(call import-module,heysdk/build/libheysdkandroidstatic_cc3/jni/)\r\n';
        mkinfo2 += '#-->\r\n';

        adtprojutils.insAndroidMK(destdir, mkinfo1, mkinfo2);
        adtprojutils.chgPkgName(destdir, projpkg);

        cocos2dxutils.chgCocos2dxActivityEx(destdir);

        cocos2dxutils.chgCocos2dxHelloWorldCpp_cc3(destdir);

        //adtprojutils.createADTProj(adtworkspace, destdir, newprojname, function () {
        //});

        //var amxmlfile1 = path.join(destdir, 'AndroidManifest.xml');
        //var amxmlfile2 = path.join('../core/projjava/heysdkbase', 'AndroidManifest.xml');
        //xmlmerge.mergeWithFile(amxmlfile1, amxmlfile2, amxmlfile1, 'AndroidManifest.csv', function () {
        //
        //});
    });
}

exports.proc = proc;

console.log('load initproj...');