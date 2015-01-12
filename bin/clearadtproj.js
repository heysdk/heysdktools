/**
 * Created by zhs007 on 2015/1/8.
 */

var exec = require('heyutils').exec;
var fileutils = require('heyutils').fileutils;
var arrutils = require('heyutils').arrutils;
var fs = require('fs');
var path = require('path');
var console = require('console');

var argv = process.argv.splice(2);

if (argv.length < 1 || argv.length > 2) {
    console.log('please input node clearadtproj.js projdir [--delassets]');

    process.exit(1);
}

var delassets = false;
var projdir = argv[0];

if (argv.length == 2) {
    if (argv[1] == '--delassets') {
        delassets = true;
    }
}

var needdeldir = ['bin', 'gen', 'obj'];
if (delassets) {
    needdeldir.push('assets');
}

fs.readdirSync(projdir).forEach(function (file, index) {
    var curdir = path.join(projdir, file);

    if (arrutils.hasChild(needdeldir, file)) {
        fileutils.delFileOrDirSync(curdir);
    }
});