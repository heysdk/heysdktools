/**
 * Created by zhs007 on 2015/1/9.
 */

var console = require('console');
var path = require('path');
var fs = require('fs');

// 这里的操作很简单，查找到第一个 '$(call import-module'，插入内容到这个前面一行
function insAndroidMK(mkfile, info) {
    var str = fs.readFileSync(mkfile).toString();
    var bi = str.indexOf('$(call import-module');
    if (bi >= 0) {
        var output = str.slice(0, bi);
        output += '\r\n';
        output += info;
        output += '\r\n';
        output += str.slice(bi, str.length);

        fs.writeFileSync(mkfile, output);
    }
}

exports.insAndroidMK = insAndroidMK;