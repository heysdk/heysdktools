/**
 * Created by zhs007 on 15/3/25.
 */

var console = require('console');
var path = require('path');
var fs = require('fs');

function proc(argv) {
    if (argv.length != 1) {
        return 'please input heysdk ver\n';
    }

    var jsonname = path.join(__dirname, 'package.json');
    var jsonstr = fs.readFileSync(jsonname);
    var obj = JSON.parse(jsonstr);
    console.log('cur ver is ' + obj.version);

    return '';
}

exports.proc = proc;

console.log('load ver...');