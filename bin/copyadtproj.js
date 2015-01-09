/**
 * Created by zhs007 on 2015/1/8.
 */

var exec = require('../exec');
var fileutils = require('../fileutils');
var arrutils = require('../arrutils');
var adtprojutils = require('../adtprojutils');
var fs = require('fs');
var path = require('path');
var console = require('console');

var argv = process.argv.splice(2);

if (argv.length != 3) {
    console.log('please input node clearadtproj.js srcdir destdir newprojname');

    process.exit(1);
}

var srcdir = argv[0];
var destdir = argv[1];
var newprojname = argv[2];

fileutils.copyFileOrDir(srcdir, destdir, function () {
    console.log('copy end.');

    adtprojutils.loadProjXML(destdir, function (err, xmlobj) {

        if (err) {
            console.log('loadProjXML ' + destdir + ' .project err ' + err);

            return ;
        }

        adtprojutils.chgProjName(xmlobj, newprojname);
        adtprojutils.saveProjXML(destdir, xmlobj, function (err) {
            if (err) {
                console.log('saveProjXML ' + destdir + ' .project err ' + err);

                return ;
            }
        });
    });
});