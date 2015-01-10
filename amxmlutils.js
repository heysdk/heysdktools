/**
 * Created by zhs007 on 2015/1/9.
 */

var xmlutils = require('./xmlutils');

function getMainActivity(filename) {
    var xmlobj = xmlutils.loadxmlSync(filename);
    var root = xmlobj.documentElement;
    if (root.nodeName == 'manifest') {
        var approot = xmlutils.findChild(root, 'application');
        if (approot != null) {
            if (approot.hasChildNodes()) {

                var nums = approot.childNodes.length;
                var childs = approot.childNodes;

                for (var i = 0; i < nums; ++i) {
                    var curobj = childs[i];
                    if (curobj.nodeName == 'activity') {
                        var filter = xmlutils.findChild(curobj, 'intent-filter');
                        if (filter != null) {
                            var action = xmlutils.findChild(filter, 'action');
                            if (action != null) {
                                if (action.getAttribute('android:name') == 'android.intent.action.MAIN') {
                                    return curobj.getAttribute('android:name');
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return '';
}

function chgPkgName(filename, pkgname) {
    var xmlobj = xmlutils.loadxmlSync(filename);
    var root = xmlobj.documentElement;
    if (root.nodeName == 'manifest') {
        root.setAttribute('package', pkgname);
    }
}

exports.getMainActivity = getMainActivity;
exports.chgPkgName = chgPkgName;