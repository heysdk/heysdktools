/**
 * Created by zhs007 on 15/3/2.
 */

var config = require('../config');
var path = require('path');
var basesdk = require('./base');
var adtprojutils = require('../adtprojutils');
var amxmlutils = require('../amxmlutils');

function proc(projcfg, next) {
    console.log('begin downjoy');

    var platform = 'android';
    if (projcfg.platform == 'android') {
        platform = 'android';
    }
    else if (projcfg.platform == 'ios') {
        platform = 'ios';
    }

    var srcdir = path.join(config.corepath, 'sdk', platform, 'downjoy');
    var destdir = projcfg.destprojpath;
    var destdir1 = path.join(projcfg.destprojpath, '../');

    basesdk.copySDKFiles(srcdir, destdir1, function (isok) {
        console.log('copy downjoy end.');

        adtprojutils.addJavaSrcPath(projcfg.destprojpath, 'heysdk-downjoy', '$%7BPARENT-1-PROJECT_LOC%7D/heysdk/heysdkjava/plugins/downjoy');
        adtprojutils.addLibrary(projcfg.destprojpath, '../library.downjoy');

        var filename = path.join(projcfg.destprojpath, 'AndroidManifest.xml');

        if (projcfg.sdk.hasOwnProperty('downjoy')) {
            var metalist = [];

            metalist.push({name: 'HEYSDK_DOWNJOY', val: 1});

            if (projcfg.sdk.downjoy.hasOwnProperty('appid')) {
                metalist.push({name: 'DOWNJOY_APPID', val: projcfg.sdk.downjoy.appid});
            }

            if (projcfg.sdk.downjoy.hasOwnProperty('appkey')) {
                metalist.push({name: 'DOWNJOY_APPKEY', val: projcfg.sdk.downjoy.appkey});
            }

            if (projcfg.sdk.downjoy.hasOwnProperty('merchantid')) {
                metalist.push({name: 'DOWNJOY_MERCHANTID', val: projcfg.sdk.downjoy.merchantid});
            }

            amxmlutils.addMetaList(filename, metalist);

            var lstPermission = [];
            lstPermission.push('android.permission.INTERNET');
            lstPermission.push('android.permission.ACCESS_NETWORK_STATE');
            lstPermission.push('android.permission.ACCESS_WIFI_STATE');
            lstPermission.push('android.permission.CHANGE_WIFI_STATE');
            lstPermission.push('android.permission.READ_PHONE_STATE');
            lstPermission.push('android.permission.WRITE_EXTERNAL_STORAGE');
            lstPermission.push('android.permission.SYSTEM_ALERT_WINDOW');
            lstPermission.push('android.permission.SEND_SMS');
            lstPermission.push('android.permission.CHANGE_NETWORK_STATE');
            lstPermission.push('android.permission.ACCESS_COARSE_LOCATION');
            lstPermission.push('android.permission.READ_SMS');
            lstPermission.push('android.permission.ACCESS_FINE_LOCATION');
            lstPermission.push('android.permission.WRITE_SETTINGS');
            lstPermission.push('android.permission.READ_SETTINGS');
            lstPermission.push('android.permission.MOUNT_UNMOUNT_FILESYSTEMS');
            lstPermission.push('android.permission.GET_TASKS');
            lstPermission.push('android.permission.READ_LOGS');
            amxmlutils.addPermissionList(filename, lstPermission);

            amxmlutils.addActivity(filename, {name: 'com.downjoy.activity.SdkActivity',
                windowSoftInputMode: 'stateHidden|adjustResize',
                configChanges: 'orientation|keyboardHidden|screenSize',
                theme: '@style/dcn_Activity_Transparent'});

            amxmlutils.addActivity(filename, {name: 'com.unionpay.uppay.PayActivity',
                configChanges: 'orientation|keyboardHidden|screenSize',
                excludeFromRecents: 'true',
                label: '@string/app_name',
                screenOrientation: 'portrait'});

            amxmlutils.addActivity(filename, {name: 'com.alipay.android.mini.window.sdk.MiniPayActivity',
                    configChanges: "orientation",
                    excludeFromRecents: "true",
                    exported: "false",
                    label: "@string/msp_app_name",
                    launchMode: "singleTop",
                    process: "com.alipay.sdk",
                    screenOrientation: "portrait",
                    theme: "@style/MspAppTheme",
                    windowSoftInputMode: "adjustResize|stateHidden"},
                {priority: 800, xmlnodechilds: [
                    {xmlnodename: 'action', name: 'android.intent.action.MAIN'},
                    {xmlnodename: 'category', name: 'android.intent.category.DEFAULT'}]});

            amxmlutils.addActivity(filename, {name: 'com.alipay.android.mini.window.sdk.MiniWebActivity',
                    configChanges: "orientation|keyboardHidden|navigation",
                    excludeFromRecents: "true",
                    exported: "false",
                    launchMode: "singleTop",
                    process: "com.alipay.sdk",
                    theme: "@style/MspAppTheme"},
                {xmlnodechilds: [
                    {xmlnodename: 'action', name: 'android.intent.action.MAIN'},
                    {xmlnodename: 'category', name: 'android.intent.category.DEFAULT'}]});

            amxmlutils.addService(filename, {name: "com.alipay.android.app.MspService",
                    process: "com.alipay.sdk",
                    exported: "false"},
                {priority: 800});

            amxmlutils.addService(filename, {name: "com.downjoy.service.PollingService"},
                {xmlnodechilds: [
                    {xmlnodename: 'action', name: 'action.downjoy.polling.service'}]});

            next();
        }
    });
}

exports.proc = proc;

console.log('load sdkscript downjoy...');