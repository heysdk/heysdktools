/**
 * Created by zhs007 on 15/2/24.
 */

var config = require('../config');
var path = require('path');
var basesdk = require('./base');
var adtprojutils = require('../adtprojutils');
var amxmlutils = require('../amxmlutils');
var xcodeutils = require('../xcodeutils');

function procAndroid(projcfg, next) {
    var platform = 'android';
    var srcdir = path.join(config.corepath, 'sdk', platform, 'dataeye');
    var destdir = projcfg.destprojpath;

    basesdk.copySDKFiles(srcdir, destdir, function (isok) {
        console.log('copy uemng end.');

        adtprojutils.addJavaSrcPath(projcfg.destprojpath, 'heysdk-umeng', '$%7BPARENT-1-PROJECT_LOC%7D/heysdk/heysdkjava/plugins/umeng');

        var filename = path.join(projcfg.destprojpath, 'AndroidManifest.xml');

        if (projcfg.sdk.hasOwnProperty('umeng')) {
            var metalist = [];

            metalist.push({name: 'HEYSDK_UMENG', val: 1});

            if (projcfg.sdk.umeng.hasOwnProperty('appkey')) {
                metalist.push({name: 'UMENG_APPKEY', val: projcfg.sdk.umeng.appkey});
            }

            metalist.push({name: 'UMENG_CHANNEL', val: projcfg.platform + projcfg.channel});

            amxmlutils.addMetaList(filename, metalist);
        }

        next();
    });
}

function procIOS(projcfg, next) {
    var platform = 'ios';

    var xcodeproj = path.join(projcfg.destprojpath, projcfg.destprojname + '.xcodeproj');
    var proj = xcodeutils.loadSync(xcodeproj);

    var dataeyeuuid = xcodeutils.addGroup(proj, 'dataeye', 'dataeye', 'HeySDK/plugins');

    xcodeutils.addSourceFileEx(proj, 'HeyDataEye.mm', xcodeutils.getGroupWithUUID(proj, dataeyeuuid));
    xcodeutils.addHeaderFileEx(proj, 'HeyDataEye.h', xcodeutils.getGroupWithUUID(proj, dataeyeuuid));
    xcodeutils.addHeaderFileEx(proj, 'DCAgent.h', xcodeutils.getGroupWithUUID(proj, dataeyeuuid));
    xcodeutils.addHeaderFileEx(proj, 'DCAccountType.h', xcodeutils.getGroupWithUUID(proj, dataeyeuuid));
    xcodeutils.addHeaderFileEx(proj, 'DCGender.h', xcodeutils.getGroupWithUUID(proj, dataeyeuuid));
    xcodeutils.addHeaderFileEx(proj, 'DCReportMode.h', xcodeutils.getGroupWithUUID(proj, dataeyeuuid));
    xcodeutils.addHeaderFileEx(proj, 'DCTaskType.h', xcodeutils.getGroupWithUUID(proj, dataeyeuuid));
    xcodeutils.addLibraryFileEx(proj, 'libDataEye.a', xcodeutils.getGroupWithUUID(proj, dataeyeuuid));

    xcodeutils.add2ProjLibrarySearchPathEx(proj, '$(SRCROOT)/../heysdk/ios/plugins/dataeye', projcfg.destprojname + ' iOS');

    var uuidFrameworks = xcodeutils.getGroupUUID(proj, 'Frameworks');
    var groupFrameworks = xcodeutils.getGroupWithUUID(proj, uuidFrameworks);
    xcodeutils.addFrameworkFileEx(proj, 'SystemConfiguration.framework', groupFrameworks, projcfg.destprojname + ' iOS');
    xcodeutils.addFrameworkFileEx(proj, 'CoreTelephony.framework', groupFrameworks, projcfg.destprojname + ' iOS');
    xcodeutils.addFrameworkFileEx(proj, 'libz.dylib', groupFrameworks, projcfg.destprojname + ' iOS');
    xcodeutils.addFrameworkFileEx(proj, 'Security.framework', groupFrameworks, projcfg.destprojname + ' iOS');
    xcodeutils.addFrameworkFileEx(proj, 'AdSupport.framework', groupFrameworks, projcfg.destprojname + ' iOS', true);

    xcodeutils.addMacroDef(proj, 'HEYSDK_USE_DATAEYE', projcfg.destprojname + ' iOS');

    xcodeutils.saveSync(xcodeproj, proj);

    next();
}

function proc(projcfg, next) {
    console.log('begin dataeye');

    if (projcfg.platform == 'android') {
        procAndroid(projcfg, next);
    }
    else if (projcfg.platform == 'ios') {
        procIOS(projcfg, next);
    }
}

exports.proc = proc;

console.log('load sdkscript dataeye...');