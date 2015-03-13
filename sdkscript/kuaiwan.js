/**
 * Created by zhs007 on 15/2/28.
 */

var config = require('../config');
var path = require('path');
var basesdk = require('./base');
var adtprojutils = require('../adtprojutils');
var amxmlutils = require('../amxmlutils');

function proc(projcfg, next) {
    console.log('begin kuaiwan');

    var platform = 'android';
    if (projcfg.platform == 'android') {
        platform = 'android';
    }
    else if (projcfg.platform == 'ios') {
        platform = 'ios';
    }

    var srcdir = path.join(config.corepath, 'sdk', platform, 'kuaiwan');
    var destdir = projcfg.destprojpath;
    var destdir1 = path.join(projcfg.destprojpath, '../');

    basesdk.copyLibraryProj(srcdir, destdir1, function (isok) {
        console.log('copy kuaiwan end.');

        adtprojutils.addJavaSrcPath(projcfg.destprojpath, 'heysdk-kuaiwan', '$%7BPARENT-1-PROJECT_LOC%7D/heysdk/heysdkjava/plugins/kuaiwan');
        adtprojutils.addLibrary(projcfg.destprojpath, '../library.kuaiwan');

        var filename = path.join(projcfg.destprojpath, 'AndroidManifest.xml');

        if (projcfg.sdk.hasOwnProperty('kuaiwan')) {
            var metalist = [];

            metalist.push({name: 'HEYSDK_KUAIWAN', val: 1});

            if (projcfg.sdk.kuaiwan.hasOwnProperty('appid')) {
                metalist.push({name: 'KUAIWAN_APPID', val: projcfg.sdk.kuaiwan.appid});
            }

            amxmlutils.addMetaList(filename, metalist);

            var lstPermission = [];
            lstPermission.push('android.permission.INTERNET');
            lstPermission.push('android.permission.ACCESS_NETWORK_STATE');
            lstPermission.push('android.permission.CALL_PHONE');
            lstPermission.push('android.permission.READ_PHONE_STATE');
            lstPermission.push('android.permission.ACCESS_WIFI_STATE');
            lstPermission.push('android.permission.READ_PHONE_STATE');
            amxmlutils.addPermissionList(filename, lstPermission);

            amxmlutils.addActivity(filename, {name: 'com.qvod.pay.ChargeActivity',
                configChanges: 'keyboardHidden|orientation|screenSize'});

            amxmlutils.addActivity(filename, {name: 'com.unionpay.uppay.PayActivityEx',
                configChanges: 'orientation|keyboardHidden|screenSize',
                excludeFromRecents: 'true',
                label: '@string/app_name',
                screenOrientation: 'portrait',
                windowSoftInputMode: 'adjustResize'});

            amxmlutils.addActivity(filename, {name: 'com.unionpay.uppay.PayActivity',
                configChanges: 'orientation|keyboardHidden|screenSize',
                excludeFromRecents: 'true',
                screenOrientation: 'portrait',
                theme: '@style/Theme.UPPay'});

            next();
        }
    });
}

exports.proc = proc;

console.log('load sdkscript kuaiwan...');