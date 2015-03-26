/**
 * Created by zhs007 on 15/3/25.
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

    var threekuuuid = xcodeutils.addGroup(proj, 'threeku', 'threeku', 'HeySDK/plugins');

    xcodeutils.addSourceFileEx(proj, 'HeyThreeKuIOS.mm', xcodeutils.getGroupWithUUID(proj, threekuuuid));
    xcodeutils.addSourceFileEx(proj, 'ThreeKuHelper.mm', xcodeutils.getGroupWithUUID(proj, threekuuuid));
    xcodeutils.addHeaderFileEx(proj, 'ThreeKuHelper.h', xcodeutils.getGroupWithUUID(proj, threekuuuid));
    xcodeutils.addHeaderFileEx(proj, 'HeyThreeKuIOS.h', xcodeutils.getGroupWithUUID(proj, threekuuuid));

    xcodeutils.addOtherFrameworkFileEx(proj, 'ThreeKuSdk.framework', xcodeutils.getGroupWithUUID(proj, threekuuuid), projcfg.destprojname + ' iOS');
    xcodeutils.add2ProjFrameworkSearchPathEx(proj, '$(SRCROOT)/../heysdk/ios/plugins/threeku', projcfg.destprojname + ' iOS');

    var uuidFrameworks = xcodeutils.getGroupUUID(proj, 'Frameworks');
    var groupFrameworks = xcodeutils.getGroupWithUUID(proj, uuidFrameworks);
    xcodeutils.addFrameworkFileEx(proj, 'SystemConfiguration.framework', groupFrameworks, projcfg.destprojname + ' iOS');

    xcodeutils.addMacroDef(proj, 'HEYSDK_USE_THREEKU', projcfg.destprojname + ' iOS');

    xcodeutils.saveSync(xcodeproj, proj);

    next();
}

function proc(projcfg, next) {
    console.log('begin threeku');

    if (projcfg.platform == 'android') {
        procAndroid(projcfg, next);
    }
    else if (projcfg.platform == 'ios') {
        procIOS(projcfg, next);
    }
}

exports.proc = proc;

console.log('load sdkscript threeku...');