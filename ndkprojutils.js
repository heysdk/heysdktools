/**
 * Created by zhs007 on 2015/1/9.
 */

var console = require('console');
var path = require('path');
var fs = require('fs');

// 这里的操作很简单，查找到第一个 '$(call import-module'，插入内容到这个前面一行
function insAndroidMK(mkfile, info1, info2) {
    var str = fs.readFileSync(mkfile).toString();
    var bi1 = str.indexOf('include $(BUILD_SHARED_LIBRARY)');
    if (bi1 >= 0) {
        var output = str.slice(0, bi1);
        output += '\r\n';
        output += info1;
        output += '\r\n';
        output += str.slice(bi1, str.length);

        str = output;

        var bi2 = str.indexOf('$(call import-module');
        if (bi2 >= 0) {
            output = str.slice(0, bi2);
            output += '\r\n';
            output += info2;
            output += '\r\n';
            output += str.slice(bi2, str.length);
        }

        fs.writeFileSync(mkfile, output);
    }
}

exports.insAndroidMK = insAndroidMK;

console.log('load ndkprojutils...');