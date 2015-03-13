/**
 * Created by zhs007 on 15/3/10.
 */

var config = require('../config');
var path = require('path');
var basesdk = require('./base');
var adtprojutils = require('../adtprojutils');
var amxmlutils = require('../amxmlutils');
var xcodeutils = require('../xcodeutils');

function procIOS(projcfg, next) {
    var platform = 'ios';

    var xcodeproj = path.join(projcfg.destprojpath, projcfg.destprojname + '.xcodeproj');
    var proj = xcodeutils.loadSync(xcodeproj);

    var gamecenteruuid = xcodeutils.addGroup(proj, 'gamecenter', 'gamecenter', 'HeySDK/plugins');

    xcodeutils.addSourceFileEx(proj, 'HeyGameCenter.mm', xcodeutils.getGroupWithUUID(proj, gamecenteruuid));
    xcodeutils.addSourceFileEx(proj, 'GCHelper.mm', xcodeutils.getGroupWithUUID(proj, gamecenteruuid));
    xcodeutils.addHeaderFileEx(proj, 'GCHelper.h', xcodeutils.getGroupWithUUID(proj, gamecenteruuid));
    xcodeutils.addHeaderFileEx(proj, 'HeyGameCenter.h', xcodeutils.getGroupWithUUID(proj, gamecenteruuid));

    var uuidFrameworks = xcodeutils.getGroupUUID(proj, 'Frameworks');
    var groupFrameworks = xcodeutils.getGroupWithUUID(proj, uuidFrameworks);
    xcodeutils.addFrameworkFileEx(proj, 'GameKit.framework', groupFrameworks, projcfg.destprojname + ' iOS');

    xcodeutils.addMacroDef(proj, 'HEYSDK_USE_GAMECENTER', projcfg.destprojname + ' iOS');

    xcodeutils.saveSync(xcodeproj, proj);

    next();
}

function proc(projcfg, next) {
    console.log('begin gamecenter');

    if (projcfg.platform == 'ios') {
        procIOS(projcfg, next);
    }
}

exports.proc = proc;

console.log('load sdkscript gamecenter...');