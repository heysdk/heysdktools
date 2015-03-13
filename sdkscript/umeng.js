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
    var srcdir = path.join(config.corepath, 'sdk', platform, 'umeng');
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
    //xcodeutils.addMacroDef(proj, 'HEYSDK_USE_UMENG', projcfg.destprojname);

    var umenguuid = xcodeutils.addGroup(proj, 'umeng', 'umeng', 'HeySDK/plugins');
    var incuuid = xcodeutils.addGroup(proj, 'inc', 'inc', 'HeySDK/plugins/umeng');
    var libsuuid = xcodeutils.addGroup(proj, 'libs', 'libs', 'HeySDK/plugins/umeng');

    xcodeutils.addSourceFileEx(proj, 'HeyUMeng.mm', xcodeutils.getGroupWithUUID(proj, umenguuid));
    xcodeutils.addHeaderFileEx(proj, 'HeyUMeng.h', xcodeutils.getGroupWithUUID(proj, umenguuid));
    xcodeutils.addHeaderFileEx(proj, 'MobClick.h', xcodeutils.getGroupWithUUID(proj, incuuid));
    xcodeutils.addHeaderFileEx(proj, 'MobClickGameAnalytics.h', xcodeutils.getGroupWithUUID(proj, incuuid));
    xcodeutils.addLibraryFileEx(proj, 'libMobClickGameLibrary.a', xcodeutils.getGroupWithUUID(proj, libsuuid));

    xcodeutils.add2ProjLibrarySearchPathEx(proj, '$(SRCROOT)/../heysdk/ios/plugins/umeng/libs', projcfg.destprojname + ' iOS');

    xcodeutils.addMacroDef(proj, 'HEYSDK_USE_UMENG', projcfg.destprojname + ' iOS');

    xcodeutils.saveSync(xcodeproj, proj);

    next();
}

function proc(projcfg, next) {
    console.log('begin uemng');

    if (projcfg.platform == 'android') {
        procAndroid(projcfg, next);
    }
    else if (projcfg.platform == 'ios') {
        procIOS(projcfg, next);
    }
}

exports.proc = proc;

console.log('load sdkscript umeng...');