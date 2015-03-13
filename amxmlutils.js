/**
 * Created by zhs007 on 2015/1/9.
 */

var xmlutils = require('heyutils').xmlutils;

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
    xmlutils.save2xmlSync(filename, xmlobj);
}

function addMeta(filename, name, val) {
    var xmlobj = xmlutils.loadxmlSync(filename);
    var app = xmlutils.findElement(xmlobj, 'manifest>application');
    if (app == null) {
        return ;
    }

    var ele = xmlutils.findElement(xmlobj, 'manifest>application>meta-data|android:name=' + name);
    if (ele != null) {
        ele.setAttribute('android:value', val);
    }
    else {
        ele = xmlutils.appendElement(app, 'meta-data');
        ele.setAttribute('android:name', name);
        ele.setAttribute('android:value', val);
    }

    xmlutils.save2xmlSync(filename, xmlobj);
}

function addMetaList(filename, lst) {
    var xmlobj = xmlutils.loadxmlSync(filename);
    var app = xmlutils.findElement(xmlobj, 'manifest>application');
    if (app == null) {
        return ;
    }

    for (var i = 0; i < lst.length; ++i) {
        var ele = xmlutils.findElement(xmlobj, 'manifest>application>meta-data|android:name=' + lst[i].name);
        if (ele != null) {
            ele.setAttribute('android:value', lst[i].val);
        }
        else {
            var ele = xmlutils.appendElement(app, 'meta-data');
            ele.setAttribute('android:name', lst[i].name);
            ele.setAttribute('android:value', lst[i].val);
        }
    }

    xmlutils.save2xmlSync(filename, xmlobj);
}

function addPermissionList(filename, lst) {
    var xmlobj = xmlutils.loadxmlSync(filename);
    var app = xmlutils.findElement(xmlobj, 'manifest');
    if (app == null) {
        return ;
    }

    for (var i = 0; i < lst.length; ++i) {
        var ele = xmlutils.findElement(xmlobj, 'manifest>uses-permission|android:name=' + lst[i]);
        if (ele == null) {
            var ele = xmlutils.appendElement(app, 'uses-permission');
            ele.setAttribute('android:name', lst[i]);
        }
    }

    xmlutils.save2xmlSync(filename, xmlobj);
}

function addActivity(filename, activity, intentfilter) {
    var xmlobj = xmlutils.loadxmlSync(filename);
    var app = xmlutils.findElement(xmlobj, 'manifest>application');
    if (app == null) {
        return ;
    }

    var ele = xmlutils.findElement(xmlobj, 'manifest>application>activity|android:name=' + activity.name);
    if (ele == null) {
        var ele = xmlutils.appendElement(app, 'activity');
        for (var key in activity) {
            ele.setAttribute('android:' + key, activity[key]);
        }

        if (intentfilter != undefined) {
            var eleintentfilter = xmlutils.appendElement(ele, 'intent-filter');
            for (var key in intentfilter) {
                if (key.indexOf('xmlnode') < 0) {
                    eleintentfilter.setAttribute('android:' + key, intentfilter[key]);
                }
                else if (key == 'xmlnodechilds') {
                    for (var nci = 0; nci < intentfilter[key].length; ++nci) {
                        var elechild = xmlutils.appendElement(eleintentfilter, intentfilter[key][nci].xmlnodename);
                        for (var key1 in intentfilter[key][nci]) {
                            if (key1.indexOf('xmlnode') < 0) {
                                elechild.setAttribute('android:' + key1, intentfilter[key][nci][key1]);
                            }
                        }
                    }
                }
            }
        }
    }

    xmlutils.save2xmlSync(filename, xmlobj);
}

function addService(filename, service, intentfilter) {
    var xmlobj = xmlutils.loadxmlSync(filename);
    var app = xmlutils.findElement(xmlobj, 'manifest>application');
    if (app == null) {
        return ;
    }

    var ele = xmlutils.findElement(xmlobj, 'manifest>application>service|android:name=' + service.name);
    if (ele == null) {
        var ele = xmlutils.appendElement(app, 'service');
        for (var key in service) {
            ele.setAttribute('android:' + key, service[key]);
        }

        if (intentfilter != undefined) {
            var eleintentfilter = xmlutils.appendElement(ele, 'intent-filter');
            for (var key in intentfilter) {
                if (key.indexOf('xmlnode') < 0) {
                    eleintentfilter.setAttribute('android:' + key, intentfilter[key]);
                }
                else if (key == 'xmlnodechilds') {
                    for (var nci = 0; nci < intentfilter[key].length; ++nci) {
                        var elechild = xmlutils.appendElement(eleintentfilter, intentfilter[key][nci].xmlnodename);
                        for (var key1 in intentfilter[key][nci]) {
                            if (key1.indexOf('xmlnode') < 0) {
                                elechild.setAttribute('android:' + key1, intentfilter[key][nci][key1]);
                            }
                        }
                    }
                }
            }
        }
    }

    xmlutils.save2xmlSync(filename, xmlobj);
}

exports.getMainActivity = getMainActivity;
exports.chgPkgName = chgPkgName;

exports.addMeta = addMeta;
exports.addMetaList = addMetaList;

exports.addPermissionList = addPermissionList;

exports.addActivity = addActivity;

exports.addService = addService;

console.log('load amxmlutils...');