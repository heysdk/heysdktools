/**
 * Created by zhs007 on 2015/1/9.
 */

var console = require('console');
var path = require('path');
var fs = require('fs');
var adtprojutils = require('./adtprojutils');

// 这里的操作很简单
// 查找到第一个 'import org.cocos2dx.lib.Cocos2dxActivity;'，改成 'import com.heysdk.lib.cocos2dx.HeyCocos2dxActivity;'
// 查找第一个 'extends Cocos2dxActivity', 改成 'extends HeyCocos2dxActivity'
function chgCocos2dxActivity(filename) {
    var src1 = 'import org.cocos2dx.lib.Cocos2dxActivity;';
    var src2 = 'extends Cocos2dxActivity';
    var str = fs.readFileSync(filename).toString();
    var bi = str.indexOf(src1);
    if (bi >= 0) {
        var output = str.slice(0, bi);
        output += 'import com.heysdk.lib.cocos2dx.HeyCocos2dxActivity;';
        output += str.slice(bi + src1.length, str.length);

        str = output;

        bi = str.indexOf(src2);
        if (bi >= 0) {
            output = str.slice(0, bi);
            output += 'extends HeyCocos2dxActivity';
            output += str.slice(bi + src2.length, str.length);
        }

        fs.writeFileSync(filename, output);
    }
}

// 这里的操作很简单
// 查找到第一个 'public cocos2d::Layer'，改成 'public HeyLayer'
// 查找到第一个 '#include'，在前面加一行 '#include "cc3/HeyLayer.h"'
function chgCocos2dxHelloWorldHpp(filename) {
    var src1 = 'public cocos2d::Layer';
    var src2 = '#include';
    var str = fs.readFileSync(filename).toString();
    var bi = str.indexOf(src1);
    if (bi >= 0) {
        var output = str.slice(0, bi);
        output += 'public HeyLayer';
        output += str.slice(bi + src1.length, str.length);

        str = output;

        bi = str.indexOf(src2);
        if (bi >= 0) {
            output = str.slice(0, bi);
            output += '#include "cc3/HeyLayer.h"';
            output += '\r\n';
            output += str.slice(bi, str.length);
        }

        fs.writeFileSync(filename, output);
    }
}

// 这里的操作很简单
// 查找到第一个 'Layer::init()'，改成 'HeyLayer::init()'
function chgCocos2dxHelloWorldCpp(filename) {
    var src1 = 'Layer::init()';
//    var src2 = '#include';
    var str = fs.readFileSync(filename).toString();
    var bi = str.indexOf(src1);
    if (bi >= 0) {
        var output = str.slice(0, bi);
        output += 'HeyLayer::init()';
        output += str.slice(bi + src1.length, str.length);

        str = output;

        //bi = str.indexOf(src2);
        //if (bi >= 0) {
        //    output = str.slice(0, bi);
        //    output += '#include "cc3/HeyLayer.h"';
        //    output += '\r\n';
        //    output += str.slice(bi, str.length);
        //}

        fs.writeFileSync(filename, output);
    }
}

function makeFilename_MainActivity(destproj, mainactivity) {
    var arr = mainactivity.split('.');
    var file = arr.join('/');
    var filename = path.join(destproj, 'src', file);

    return filename;
}

function chgCocos2dxActivityEx(destproj) {
    var mainactivity = adtprojutils.getMainActivity(destproj);
    var filename = makeFilename_MainActivity(destproj, mainactivity);
    chgCocos2dxActivity(filename + '.java');
}

function chgCocos2dxHelloWorldCpp_cc3(projdir) {
    var filename = path.join(projdir, '../Classes/HelloWorldScene.h');
    chgCocos2dxHelloWorldHpp(filename);

    filename = path.join(projdir, '../Classes/HelloWorldScene.cpp');
    chgCocos2dxHelloWorldCpp(filename);
}

exports.chgCocos2dxActivityEx = chgCocos2dxActivityEx;
exports.chgCocos2dxHelloWorldCpp_cc3 = chgCocos2dxHelloWorldCpp_cc3;