/**
 * Created by zhs007 on 15/2/24.
 */

var async = require('async');

var umeng = require('./sdkscript/umeng');
var kuaiwan = require('./sdkscript/kuaiwan');
var downjoy = require('./sdkscript/downjoy');
var gamecenter = require('./sdkscript/gamecenter');
var appleiap = require('./sdkscript/appleiap');
var xyios = require('./sdkscript/xyios');
var threeku = require('./sdkscript/threeku');

var sdkmgr = {
    umeng: umeng,
    kuaiwan: kuaiwan,
    downjoy: downjoy,
    gamecenter: gamecenter,
    appleiap: appleiap,
    xyios: xyios,
    threeku: threeku
};

function proc(projcfg) {
    if (projcfg.hasOwnProperty('sdk')) {
        var arr = [];
        for (var sdk in projcfg.sdk) {
            if (sdkmgr.hasOwnProperty(sdk)) {
                arr.push(sdk);
            }
        }

        async.eachSeries(arr, function(sdk, callback) {
            sdkmgr[sdk].proc(projcfg, callback);
        },
        function(err) {
            if (err) {
                console.log("sdkmgr proc err " + err);
            }
        });
    }
}

exports.sdkmgr = sdkmgr;

exports.proc = proc;

console.log('load sdkmgr...');