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

    var appleiapuuid = xcodeutils.addGroup(proj, 'appleiap', 'appleiap', 'HeySDK/plugins');
    var gtmbase64uuid = xcodeutils.addGroup(proj, 'GTMBase64', 'GTMBase64', 'HeySDK/plugins/appleiap');

    xcodeutils.addSourceFileEx(proj, 'HeyAppleIAP.mm', xcodeutils.getGroupWithUUID(proj, appleiapuuid));
    xcodeutils.addSourceFileEx(proj, 'IAPHelper.mm', xcodeutils.getGroupWithUUID(proj, appleiapuuid));
    xcodeutils.addHeaderFileEx(proj, 'IAPHelper.h', xcodeutils.getGroupWithUUID(proj, appleiapuuid));
    xcodeutils.addHeaderFileEx(proj, 'HeyAppleIAP.h', xcodeutils.getGroupWithUUID(proj, appleiapuuid));

    xcodeutils.addHeaderFileEx(proj, 'GTMDefines.h', xcodeutils.getGroupWithUUID(proj, gtmbase64uuid));
    xcodeutils.addHeaderFileEx(proj, 'GTMBase64.h', xcodeutils.getGroupWithUUID(proj, gtmbase64uuid));
    xcodeutils.addSourceFileEx(proj, 'GTMBase64.m', xcodeutils.getGroupWithUUID(proj, gtmbase64uuid));

    var uuidFrameworks = xcodeutils.getGroupUUID(proj, 'Frameworks');
    var groupFrameworks = xcodeutils.getGroupWithUUID(proj, uuidFrameworks);
    xcodeutils.addFrameworkFileEx(proj, 'StoreKit.framework', groupFrameworks, projcfg.destprojname + ' iOS');

    xcodeutils.addMacroDef(proj, 'HEYSDK_USE_APPLEIAP', projcfg.destprojname + ' iOS');

    xcodeutils.saveSync(xcodeproj, proj);

    next();
}

function proc(projcfg, next) {
    console.log('begin appleiap');

    if (projcfg.platform == 'ios') {
        procIOS(projcfg, next);
    }
}

exports.proc = proc;

console.log('load sdkscript appleiap...');