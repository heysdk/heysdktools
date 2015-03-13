/**
 * Created by zhs007 on 15/2/7.
 */

var console = require('console');
var path = require('path');
var cocos2dxutils = require('./cocos2dxutils');
var fs = require('fs');

function proc(argv) {
    if (argv.length != 2) {
        return 'please input heysdk init proj.json\n';
    }
    var projname = argv[1];
    var data = fs.readFileSync(projname);
    var projconfig = JSON.parse(data.toString());

    if (projconfig.channel == 'heysdk') {
        if (projconfig.gameengine == 'cocos2dx3-cpp') {
            cocos2dxutils.initproc_cc3_cpp(projconfig);
        }
        else {
            console.log('not support ' + projconfig.gameengine);
        }
    }
    else {
        if (projconfig.gameengine == 'cocos2dx3-cpp') {
            cocos2dxutils.initotherproc_cc3_cpp(projconfig);
        }
        else {
            console.log('not support ' + projconfig.gameengine);
        }
    }

    return 'initproc proc...';
}

exports.proc = proc;

console.log('load initproj...');