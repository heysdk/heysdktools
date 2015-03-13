/**
 * Created by zhs007 on 15/3/12.
 */

var config = require('../config');
var path = require('path');
var fs = require('fs');
var basesdk = require('./base');
var adtprojutils = require('../adtprojutils');
var amxmlutils = require('../amxmlutils');
var xcodeutils = require('../xcodeutils');

function procIOS(projcfg, next) {
    var platform = 'ios';

    var xcodeproj = path.join(projcfg.destprojpath, projcfg.destprojname + '.xcodeproj');
    var proj = xcodeutils.loadSync(xcodeproj);

    var xyiosuuid = xcodeutils.addGroup(proj, 'xyios', 'xyios', 'HeySDK/plugins');
    xcodeutils.addSourceFileEx(proj, 'HeyXYIOS.mm', xcodeutils.getGroupWithUUID(proj, xyiosuuid));
    xcodeutils.addSourceFileEx(proj, 'XYHelper.m', xcodeutils.getGroupWithUUID(proj, xyiosuuid));
    xcodeutils.addHeaderFileEx(proj, 'HeyXYIOS.h', xcodeutils.getGroupWithUUID(proj, xyiosuuid));
    xcodeutils.addHeaderFileEx(proj, 'XYHelper.h', xcodeutils.getGroupWithUUID(proj, xyiosuuid));
    xcodeutils.addOtherFrameworkFileEx(proj, 'XYPlatform.framework', xcodeutils.getGroupWithUUID(proj, xyiosuuid), projcfg.destprojname + ' iOS');
    xcodeutils.add2ProjFrameworkSearchPathEx(proj, '$(SRCROOT)/../heysdk/ios/plugins/xyios', projcfg.destprojname + ' iOS');
    xcodeutils.addEmbedFrameworks(proj, 'XYPlatform.framework', projcfg.destprojname + ' iOS');
    xcodeutils.addResourceFileEx(proj, 'Alixpay.bundle', xcodeutils.getGroupWithUUID(proj, xyiosuuid), projcfg.destprojname + ' iOS');
    xcodeutils.addResourceFileEx(proj, 'XYPlatformResources.bundle', xcodeutils.getGroupWithUUID(proj, xyiosuuid), projcfg.destprojname + ' iOS');

    xcodeutils.add2ProjOtherLinkerFlags(proj, '-ObjC', projcfg.destprojname + ' iOS');
    xcodeutils.add2ProjOtherLinkerFlags(proj, '-lz', projcfg.destprojname + ' iOS');
    xcodeutils.add2ProjRunPathSearchPath(proj, '"$(inherited) @executable_path/Frameworks"', projcfg.destprojname + ' iOS');

    var uuidFrameworks = xcodeutils.getGroupUUID(proj, 'Frameworks');
    var groupFrameworks = xcodeutils.getGroupWithUUID(proj, uuidFrameworks);
    xcodeutils.addFrameworkFileEx(proj, 'QuartzCore.framework', groupFrameworks, projcfg.destprojname + ' iOS');
    xcodeutils.addFrameworkFileEx(proj, 'SystemConfiguration.framework', groupFrameworks, projcfg.destprojname + ' iOS');
    xcodeutils.addFrameworkFileEx(proj, 'Security.framework', groupFrameworks, projcfg.destprojname + ' iOS');
    xcodeutils.addFrameworkFileEx(proj, 'MobileCoreServices.framework', groupFrameworks, projcfg.destprojname + ' iOS');
    xcodeutils.addFrameworkFileEx(proj, 'Libsqlite3.dylib', groupFrameworks, projcfg.destprojname + ' iOS');
    xcodeutils.addFrameworkFileEx(proj, 'Libsqlite3.dylib', groupFrameworks, projcfg.destprojname + ' iOS');
    xcodeutils.addFrameworkFileEx(proj, 'MediaPlayer.framework', groupFrameworks, projcfg.destprojname + ' iOS');
    xcodeutils.addFrameworkFileEx(proj, 'GameController.framework', groupFrameworks, projcfg.destprojname + ' iOS');

    xcodeutils.addMacroDef(proj, 'HEYSDK_USE_XYIOS', projcfg.destprojname + ' iOS');

    var effileref = xcodeutils.getFileRef(proj, 'XYPlatform.framework');
    xcodeutils.saveSync(xcodeproj, proj);

    //var str1 = '/* XYPlatform.framework in Embed Frameworks */ = {isa = PBXBuildFile; fileRef = ' + effileref + ' /* XYPlatform.framework */; };';
    //var projfilename = path.join(xcodeproj, 'project.pbxproj');
    //var str = fs.readFileSync(projfilename).toString();
    //var bi = str.indexOf(str1);
    //if (bi >= 0) {
    //    var output = str.slice(0, bi);
    //    output += '/* XYPlatform.framework in Embed Frameworks */ = {isa = PBXBuildFile; fileRef = ' + effileref + ' /* XYPlatform.framework */; settings = {ATTRIBUTES = (CodeSignOnCopy, RemoveHeadersOnCopy, ); }; };';
    //    output += str.slice(bi + str1.length, str.length);
    //    fs.writeFileSync(projfilename, output);
    //}

    next();
}

function proc(projcfg, next) {
    console.log('begin xyios');

    if (projcfg.platform == 'ios') {
        procIOS(projcfg, next);
    }
}

exports.proc = proc;

console.log('load sdkscript xyios...');