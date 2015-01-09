/**
 * Created by zhs007 on 2015/1/9.
 */

var console = require('console');
var path = require('path');
var fs = require('fs');

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

exports.insAndroidMK = insAndroidMK;