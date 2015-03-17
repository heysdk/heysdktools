/**
 * Created by zhs007 on 2015/1/9.
 */

var console = require('console');
var path = require('path');
var fs = require('fs');
var adtprojutils = require('./adtprojutils');
var fileutils = require('heyutils').fileutils;
var strutils = require('heyutils').strutils;
var sdkmgr = require('./sdkmgr');
var xcodeutils = require('./xcodeutils');

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
// 查找到第一个 'public cocos2d::Layer'，改成 'public cocos2d::Layer, public heysdk::HeySDKListener'
// 查找到第一个 '#include'，在前面加一行 '#include <HeySDK.h>'
// 查找到第一个 '{'，在后面增加侦听器接口声明
function chgCocos2dxHelloWorldHpp(filename) {
    var src1 = 'public cocos2d::Layer';
    var src2 = '#include';
    var src3 = '{';
    var str = fs.readFileSync(filename).toString();
    if (str.indexOf('heysdk::HeySDKListener') < 0) {
        var bi1 = str.indexOf(src1);
        if (bi1 >= 0) {
            var output = str.slice(0, bi1 + src1.length);
            output += ', public heysdk::HeySDKListener';
            output += str.slice(bi1 + src1.length, str.length);

            str = output;

            var bi = str.indexOf(src2);
            if (bi >= 0) {
                output = str.slice(0, bi);
                output += '#include <HeySDK.h>';
                output += '\r\n';
                output += str.slice(bi, str.length);

                str = output;
            }

            bi = str.indexOf(src3, bi1);
            if (bi >= 0) {
                output = str.slice(0, bi + src3.length);
                output += '\r\n    virtual void onLogin(heysdk::HeySDKUserInfo& ui, heysdk::HeySDKUserPlatformInfo& pui);\r\n';
                output += '\r\n    virtual void onConfigInfo(heysdk::HeySDKPaySchemeInfo& psi, heysdk::HeySDKGameConfig& cfg);\r\n';
                output += '\r\n    virtual void onPayment(heysdk::HeySDKPayment& payment);\r\n';
                output += '\r\n    virtual const char* getName() { return "helloworldscene"; }';
                output += str.slice(bi + src3.length, str.length);
            }

            fs.writeFileSync(filename, output);
        }
    }
}

// 这里的操作很简单
// 在文件的最后，增加侦听器接口实现
function chgCocos2dxHelloWorldCpp(filename) {
    var str = fs.readFileSync(filename).toString();
    var src1 = '::onLogin(heysdk::HeySDKUserInfo&';
    if (str.indexOf(src1) < 0) {
        str += '\r\nvoid HelloWorld::onLogin(heysdk::HeySDKUserInfo& ui, heysdk::HeySDKUserPlatformInfo& pui)';
        str += '\r\n{';
        str += '\r\n';
        str += '\r\n}';
        str += '\r\n';
        str += '\r\nvoid HelloWorld::onConfigInfo(heysdk::HeySDKPaySchemeInfo& psi, heysdk::HeySDKGameConfig& cfg)';
        str += '\r\n{';
        str += '\r\n';
        str += '\r\n}';
        str += '\r\n';
        str += '\r\nvoid HelloWorld::onPayment(heysdk::HeySDKPayment& payment)';
        str += '\r\n{';
        str += '\r\n';
        str += '\r\n}';
        str += '\r\n';

        fs.writeFileSync(filename, str);
    }
//    var src1 = 'Layer::init()';
////    var src2 = '#include';
//    var str = fs.readFileSync(filename).toString();
//    var bi = strutils.findWord(str, src1);//str.indexOf(src1);
//    if (bi >= 0) {
//        var output = str.slice(0, bi);
//        output += 'HeyLayer::init()';
//        output += str.slice(bi + src1.length, str.length);
//
//        str = output;
//
//        //bi = str.indexOf(src2);
//        //if (bi >= 0) {
//        //    output = str.slice(0, bi);
//        //    output += '#include "cc3/HeyLayer.h"';
//        //    output += '\r\n';
//        //    output += str.slice(bi, str.length);
//        //}
//
//        fs.writeFileSync(filename, output);
//    }
}

// 这里的操作很简单
// 查找到第一个 'public cocos2d::Application'，改成 'public HeyApplication'
// 查找到第一个 '#include'，在前面加一行 '#include "cc3/HeyApplication.h"'
function chgCocos2dxAppDelegateHpp(filename) {
    var src1 = 'private cocos2d::Application';
    var src2 = '#include';
    var str = fs.readFileSync(filename).toString();
    if (str.indexOf('"heysdk/HeyApplication.h"') < 0) {
        var bi = str.indexOf(src1);
        if (bi >= 0) {
            var output = str.slice(0, bi);
            output += 'public HeyApplication';
            output += str.slice(bi + src1.length, str.length);

            str = output;

            bi = str.indexOf(src2);
            if (bi >= 0) {
                output = str.slice(0, bi);
                output += '#include "heysdk/HeyApplication.h"';
                output += '\r\n';
                output += str.slice(bi, str.length);
            }

            fs.writeFileSync(filename, output);
        }
    }
}

// 这里的操作很简单
// 查找到第一个 'bool AppDelegate::applicationDidFinishLaunching() {'，增加 'HeyApplication::applicationDidFinishLaunching();'
// 查找到第一个 'bool AppDelegate::applicationDidEnterBackground() {'，增加 'HeyApplication::applicationDidEnterBackground();'
// 查找到第一个 'bool AppDelegate::applicationWillEnterForeground() {'，增加 'HeyApplication::applicationWillEnterForeground();'
function chgCocos2dxAppDelegateCpp(filename) {
    var src1 = 'bool AppDelegate::applicationDidFinishLaunching() {';
    var src2 = 'bool AppDelegate::applicationDidEnterBackground() {';
    var src3 = 'bool AppDelegate::applicationWillEnterForeground() {';
    var str = fs.readFileSync(filename).toString();
    if (str.indexOf('HeyApplication::applicationDidFinishLaunching()') < 0) {
        var bi = str.indexOf(src1);
        if (bi >= 0) {
            var output = str.slice(0, bi + src1.length);
            output += '\r\n    HeyApplication::applicationDidFinishLaunching();\r\n';
            output += str.slice(bi + src1.length, str.length);

            str = output;

            bi = str.indexOf(src2);
            if (bi >= 0) {
                output = str.slice(0, bi + src2.length);
                output += '\r\n    HeyApplication::applicationDidEnterBackground();\r\n';
                output += str.slice(bi + src2.length, str.length);

                str = output;
            }

            bi = str.indexOf(src3);
            if (bi >= 0) {
                output = str.slice(0, bi + src3.length);
                output += '\r\n    HeyApplication::applicationWillEnterForeground();\r\n';
                output += str.slice(bi + src3.length, str.length);

                str = output;
            }

            fs.writeFileSync(filename, output);
        }
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
    fileutils.copyfile(filename, filename + '.old', function () {
        chgCocos2dxHelloWorldHpp(filename);
    });

    var filename1 = path.join(projdir, '../Classes/HelloWorldScene.cpp');
    fileutils.copyfile(filename1, filename1 + '.old', function () {
        chgCocos2dxHelloWorldCpp(filename1);
    });
}

function chgCocos2dxAppDelegateCpp_cc3(projdir) {
    var filename = path.join(projdir, '../Classes/AppDelegate.h');
    fileutils.copyfile(filename, filename + '.old', function () {
        chgCocos2dxAppDelegateHpp(filename);
    });

    var filename1 = path.join(projdir, '../Classes/AppDelegate.cpp');
    fileutils.copyfile(filename1, filename1 + '.old', function () {
        chgCocos2dxAppDelegateCpp(filename1);
    });
}

function revertCocos2dxHelloWorldCpp_cc3(projdir) {
    var filename = path.join(projdir, '../Classes/HelloWorldScene.h');
    fileutils.copyfile(filename + '.old', filename, function () {
    });

    var filename1 = path.join(projdir, '../Classes/HelloWorldScene.cpp');
    fileutils.copyfile(filename1 + '.old', filename1, function () {
    });
}

function fixCocos2dx2JNI(projdir) {
    var filename = path.join(projdir, 'proj.android/jni/Android.mk');
    var str = fs.readFileSync(filename).toString();
    var bi1 = str.indexOf('include $(BUILD_SHARED_LIBRARY)');
    if (bi1 >= 0) {
        var output = str.slice(0, bi1);
        output += '\r\n';
        output += '$(call import-add-path,$(LOCAL_PATH)/../../../../)';
        output += '\r\n';
        output += str.slice(bi1, str.length);

        output = output.replace('LOCAL_WHOLE_STATIC_LIBRARIES += cocos2dx_static', 'LOCAL_STATIC_LIBRARIES += cocos2dx_static');
        output = output.replace('LOCAL_WHOLE_STATIC_LIBRARIES += cocosdenshion_static', 'LOCAL_STATIC_LIBRARIES += cocosdenshion_static');
        output = output.replace('LOCAL_WHOLE_STATIC_LIBRARIES += box2d_static', 'LOCAL_STATIC_LIBRARIES += box2d_static');
        output = output.replace('LOCAL_WHOLE_STATIC_LIBRARIES += chipmunk_static', 'LOCAL_STATIC_LIBRARIES += chipmunk_static');
        output = output.replace('LOCAL_WHOLE_STATIC_LIBRARIES += cocos_extension_static', 'LOCAL_STATIC_LIBRARIES += cocos_extension_static');

        fs.writeFileSync(filename, output);
    }
}

function fixCocos2dx2BuildCmd(projdir) {
    var filename = path.join(projdir, 'proj.android/.cproject');
    var str = fs.readFileSync(filename).toString();
    str = str.replace('arguments="${ProjDirPath}/build_native.sh"', 'arguments=""');
    str = str.replace('command="bash"', 'command="${NDK_ROOT}/ndk-build.cmd"');
    fs.writeFileSync(filename, str);
}

function initproc_ios_cc3_cpp(projconfig) {
    var srcdir = projconfig.projpath;
    var destdir = projconfig.destprojpath;
    var newprojname = projconfig.destprojname;
    var projpkg = projconfig.destpkgname;

    console.log('src proj is ' + srcdir);
    console.log('src proj platform is ' + projconfig.platform);
    console.log('dest proj is ' + destdir);
    console.log('dest proj name is ' + newprojname);
    console.log('dest proj pkg is ' + projpkg);

    fileutils.delFileOrDirSync(destdir);

    fileutils.copyFileOrDir(srcdir, destdir, function (srcpath, destpath, isok) {
        if (srcpath != srcdir || destpath != destdir) {
            return "copyFileOrDir() " + srcpath + " " + destpath;
        }

        console.log('copy proj end.');

        var tmppath = path.join(__dirname, 'template/cocos2dxv3');
        var classpath = path.join(destpath, '../Classes');
        fileutils.copyFileOrDir(tmppath, classpath + '/heysdk', function (srcpath, destpath, isok) {
            console.log('copy template end.');

            var projpath = path.join(destdir, projconfig.projname + '.xcodeproj');
            xcodeutils.clearProj(projpath);

            xcodeutils.chgProjName(destdir, projconfig.projname, newprojname, function() {
                var xcodeproj = path.join(destdir, newprojname + '.xcodeproj');
                var proj = xcodeutils.loadSync(xcodeproj);

                var heysdkuuid = xcodeutils.addGroup(proj, 'heysdk', 'heysdk', 'Classes');
                xcodeutils.addSourceFileEx(proj, 'HeyApplication.cpp', xcodeutils.getGroupWithUUID(proj, heysdkuuid));
                xcodeutils.addHeaderFileEx(proj, 'HeyApplication.h', xcodeutils.getGroupWithUUID(proj, heysdkuuid));
                xcodeutils.addHeaderFileEx(proj, 'HeySDKConfig.h', xcodeutils.getGroupWithUUID(proj, heysdkuuid));

                xcodeutils.addMacroDef(proj, projconfig.macro, projconfig.destprojname + ' iOS');
                //xcodeutils.addMacroDef(proj, 'HEYSDK_PLATFORM=\\"' + projconfig.platform + '\\"', projconfig.destprojname + ' iOS');
                //xcodeutils.addMacroDef(proj, 'HEYSDK_CHANNEL=\\"' + projconfig.channel + '\\"', projconfig.destprojname + ' iOS');

                xcodeutils.addGroup(proj, 'HeySDK', '../heysdk/ios', '');
                xcodeutils.addGroup(proj, 'plugins', 'plugins', 'HeySDK');

                xcodeutils.addSourceFile(proj, 'HeyThirdSDKMgr.cpp', 'HeySDK');
                xcodeutils.addHeaderFile(proj, 'HeyThirdSDK.h', 'HeySDK');
                xcodeutils.addHeaderFile(proj, 'HeyThirdSDKMgr.h', 'HeySDK');

                xcodeutils.addChildLibProj(proj, '../heysdk/build/heysdklib_cc3_cpp/heysdklib_cc3_cpp.xcodeproj',
                    [
                        {afile: 'libheysdklibios.a', target: newprojname + ' iOS', libtarget: 'heysdklibios'},
                        {afile: 'libheysdklibmac.a', target: newprojname + ' Mac', libtarget: 'heysdklibmac'}
                    ]);

                xcodeutils.add2ProjHeaderSearchPath(proj, '$(SRCROOT)/../heysdk/src', newprojname);
                xcodeutils.add2ProjHeaderSearchPath(proj, '$(SRCROOT)/../heysdk/ios', newprojname);
                //xcodeutils.addGroup(proj, 'HeySDK', '../heysdk/heysdkcpp');
                //xcodeutils.addSourceFile(proj, '../../Classes/HeySDK.cpp', 'HeySDK');
                //xcodeutils.addHeaderFile(proj, '../../Classes/HeySDK.h', 'HeySDK');
                xcodeutils.saveSync(xcodeproj, proj);

                chgCocos2dxHelloWorldCpp_cc3(destdir);
                chgCocos2dxAppDelegateCpp_cc3(destdir);

                sdkmgr.proc(projconfig);
            });
        });
    });
}

function initproc_android_cc3_cpp(projconfig) {
    var srcdir = projconfig.projpath;
    var destdir = projconfig.destprojpath;
    var newprojname = projconfig.destprojname;
    var projpkg = projconfig.destpkgname;

    console.log('src proj is ' + srcdir);
    console.log('src proj platform is ' + projconfig.platform);
    console.log('dest proj is ' + destdir);
    console.log('dest proj name is ' + newprojname);
    console.log('dest proj pkg is ' + projpkg);

    fileutils.copyFileOrDir(srcdir, destdir, function (srcpath, destpath, isok) {
        if (srcpath != srcdir || destpath != destdir) {
            return "copyFileOrDir() " + srcpath + " " + destpath;
        }

        console.log('copy proj end.');

        var xmlobj = adtprojutils.loadProjXML(destdir);
        adtprojutils.chgProjName(xmlobj, newprojname);
        adtprojutils.addLinkedResources(xmlobj, 'heysdk-base', '$%7BPARENT-1-PROJECT_LOC%7D/heysdk/heysdkjava/src');
        adtprojutils.addLinkedResources(xmlobj, 'heysdk-cocos2dx', '$%7BPARENT-1-PROJECT_LOC%7D/heysdk/heysdkjava/plugins/cocos2dx');
        adtprojutils.addLinkedResources(xmlobj, 'heysdkcpp', '$%7BPARENT-1-PROJECT_LOC%7D/heysdk/heysdkcpp');
        adtprojutils.saveProjXML(destdir, xmlobj);

        xmlobj = adtprojutils.loadClassPathXML(destdir);
        adtprojutils.addClassPath(xmlobj, 'heysdk-base');
        adtprojutils.addClassPath(xmlobj, 'heysdk-cocos2dx');
        adtprojutils.saveClassPathXML(destdir, xmlobj);

        var mkinfo1 = '#<--heysdk\r\n';
        mkinfo1 += 'LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../heysdk/heysdkcpp\r\n';
        mkinfo1 += 'LOCAL_WHOLE_STATIC_LIBRARIES += libheysdkcpp_static\r\n';
        mkinfo1 += '#-->\r\n';

        var mkinfo2 = '#<--heysdk\r\n';
        mkinfo2 += '$(call import-add-path,$(LOCAL_PATH)/../../)\r\n';
        mkinfo2 += '$(call import-module,heysdk/build/libheysdkandroidstatic_cc3/jni/)\r\n';
        mkinfo2 += '#-->\r\n';

        adtprojutils.insAndroidMK(destdir, mkinfo1, mkinfo2);
        adtprojutils.chgPkgName(destdir, projpkg);
        adtprojutils.procConfig(destdir, projconfig);

        chgCocos2dxActivityEx(destdir);

        chgCocos2dxHelloWorldCpp_cc3(destdir);
        chgCocos2dxAppDelegateCpp_cc3(destdir);

        sdkmgr.proc(projconfig);
    });
}

function initproc_cc3_cpp(projconfig) {
    if (projconfig.platform == 'android') {
        initproc_android_cc3_cpp(projconfig);
    }
    else if(projconfig.platform == 'ios') {
        initproc_ios_cc3_cpp(projconfig);
    }
}

function initotherproc_android_cc3_cpp(projconfig) {
    var srcdir = projconfig.projpath;
    var destdir = projconfig.destprojpath;
    var newprojname = projconfig.destprojname;
    var projpkg = projconfig.destpkgname;

    console.log('src proj is ' + srcdir);
    console.log('dest proj is ' + destdir);
    console.log('dest proj name is ' + newprojname);
    console.log('dest proj pkg is ' + projpkg);

    fileutils.copyFileOrDir(srcdir, destdir, function (srcpath, destpath, isok) {
        if (srcpath != srcdir || destpath != destdir) {
            return "copyFileOrDir() " + srcpath + " " + destpath;
        }

        console.log('copy proj end.');

        var xmlobj = adtprojutils.loadProjXML(destdir);
        adtprojutils.chgProjName(xmlobj, newprojname);
        adtprojutils.saveProjXML(destdir, xmlobj);

        adtprojutils.chgPkgName(destdir, projpkg);

        sdkmgr.proc(projconfig);
    });
}

function initotherproc_ios_cc3_cpp(projconfig) {
    var srcdir = projconfig.projpath;
    var destdir = projconfig.destprojpath;
    var newprojname = projconfig.destprojname;
    var projpkg = projconfig.destpkgname;

    console.log('src proj is ' + srcdir);
    console.log('src proj platform is ' + projconfig.platform);
    console.log('dest proj is ' + destdir);
    console.log('dest proj name is ' + newprojname);
    console.log('dest proj pkg is ' + projpkg);

//    var xcodeproj = path.join(destdir, newprojname + '.xcodeproj');
//    var proj = xcodeutils.loadSync(xcodeproj);

    fileutils.delFileOrDirSync(destdir);

    fileutils.copyFileOrDir(srcdir, destdir, function (srcpath, destpath, isok) {
        if (srcpath != srcdir || destpath != destdir) {
            return "copyFileOrDir() " + srcpath + " " + destpath;
        }

        console.log('copy proj end.');

        var projpath = path.join(destdir, projconfig.projname + '.xcodeproj');
        xcodeutils.clearProj(projpath);

        xcodeutils.chgProjName(destdir, projconfig.projname, newprojname, function() {
            var xcodeproj = path.join(destdir, newprojname + '.xcodeproj');
            var proj = xcodeutils.loadSync(xcodeproj);

            xcodeutils.delMacroDef(proj, 'HEYSDK_IOS_HEYSDK', projconfig.destprojname + ' iOS');
            xcodeutils.addMacroDef(proj, projconfig.macro, projconfig.destprojname + ' iOS');
            //xcodeutils.delMacroDef(proj, 'HEYSDK_CHANNEL=\\"heysdk\\"', projconfig.destprojname + ' iOS');
            //xcodeutils.addMacroDef(proj, 'HEYSDK_CHANNEL=\\"' + projconfig.channel + '\\"', projconfig.destprojname + ' iOS');

            xcodeutils.saveSync(xcodeproj, proj);

            sdkmgr.proc(projconfig);
        });
    });
}

function initotherproc_cc3_cpp(projconfig) {
    if (projconfig.platform == 'android') {
        initotherproc_android_cc3_cpp(projconfig);
    }
    else if(projconfig.platform == 'ios') {
        initotherproc_ios_cc3_cpp(projconfig);
    }
}

exports.chgCocos2dxActivityEx = chgCocos2dxActivityEx;
exports.chgCocos2dxHelloWorldCpp_cc3 = chgCocos2dxHelloWorldCpp_cc3;
exports.chgCocos2dxAppDelegateCpp_cc3 = chgCocos2dxAppDelegateCpp_cc3;
exports.fixCocos2dx2JNI = fixCocos2dx2JNI;
exports.fixCocos2dx2BuildCmd = fixCocos2dx2BuildCmd;
exports.revertCocos2dxHelloWorldCpp_cc3 = revertCocos2dxHelloWorldCpp_cc3;

exports.initproc_cc3_cpp = initproc_cc3_cpp;
exports.initotherproc_cc3_cpp = initotherproc_cc3_cpp;

console.log('load cocos2dxutils...');