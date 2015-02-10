/**
 * Created by zhs007 on 15/2/10.
 */

var fileutils = require('heyutils').fileutils;
var arrutils = require('heyutils').arrutils;
var fs = require('fs');
var path = require('path');
var console = require('console');

function proc(argv) {
    if (argv.length < 2 || argv.length > 3) {
        return 'please input heysdk clearadtproj projdir [--delassets]';
    }

    var delassets = false;
    var projdir = argv[1];

    if (argv.length == 3) {
        if (argv[2] == '--delassets') {
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

    return '';
}

exports.proc = proc;

console.log('load clearadtproj...');