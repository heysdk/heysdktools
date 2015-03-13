/**
 * Created by zhs007 on 15/2/25.
 */

var config = require('../config');
var path = require('path');
var fileutils = require('heyutils').fileutils;

function copySDKFiles(srcdir, destdir, callback) {
    fileutils.copyFileOrDir(srcdir, destdir, function (srcpath, destpath, isok) {
        if (srcpath != srcdir || destpath != destdir) {
            return;
        }

        callback(isok);
    });
}

function copyLibraryProj(srcdir, destdir, callback) {
    fileutils.copyFileOrDir(srcdir, destdir, function (srcpath, destpath, isok) {
        if (srcpath != srcdir || destpath != destdir) {
            return;
        }

        callback(isok);
    });
}

exports.copySDKFiles = copySDKFiles;
exports.copyLibraryProj = copyLibraryProj;

console.log('load sdkscript base...');