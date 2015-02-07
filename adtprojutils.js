/**
 * Created by zhs007 on 2015/1/8.
 */

var console = require('console');
var path = require('path');
var fs = require('fs');
var xmlutils = require('heyutils').xmlutils;
var ndkprojutils = require('./ndkprojutils');
var amxmlutils = require('./amxmlutils');
var fileutils = require('heyutils').fileutils;

function loadProjXML(projpath) {
    var filename = path.join(projpath, '.project');
    return xmlutils.loadxmlSync(filename);
}

function saveProjXML(projpath, xmlobj) {
    var filename = path.join(projpath, '.project');
    xmlutils.save2xmlSync(filename, xmlobj);
}

function chgProjName(xmlobj, newname) {
    var root = xmlobj.documentElement;
    if (root.nodeName == 'projectDescription') {
        var projname = xmlutils.findChild(root, 'name');
        if (projname != null) {
            xmlutils.chgValue(projname, newname);
        }
    }
}

function findLinkedResources(xmlobj, resname) {
    var ele = xmlutils.findElement(xmlobj, 'projectDescription>linkedResources>link>name=' + resname);
    if (ele != null) {
        return true;
    }

    return false;
    //
    //var root = xmlobj.documentElement;
    //if (root.nodeName == 'projectDescription') {
    //    var linkroot = xmlutils.findChild(root, 'linkedResources');
    //    if (linkroot != null) {
    //        if (linkroot.hasChildNodes()) {
    //
    //            var nums = linkroot.childNodes.length;
    //            var childs = linkroot.childNodes;
    //
    //            for (var i = 0; i < nums; ++i) {
    //                var curresname = xmlutils.getChildValue(childs[i], 'name');
    //                if (curresname == resname) {
    //                    return true;
    //                }
    //            }
    //        }
    //    }
    //}
    //
    //return false;
}

function addLinkedResources(xmlobj, resname, resdir) {
    if (findLinkedResources(xmlobj, resname)) {
        return ;
    }

    var root = xmlobj.documentElement;
    if (root.nodeName == 'projectDescription') {
        var linkroot = xmlutils.findChild(root, 'linkedResources');
        if (linkroot != null) {
            var link = xmlutils.appendElement(linkroot, 'link');

            xmlutils.appendTextNode(xmlutils.appendElement(link, 'name'), resname);
            xmlutils.appendTextNode(xmlutils.appendElement(link, 'type'), '2');
            xmlutils.appendTextNode(xmlutils.appendElement(link, 'locationURI'), resdir);
        }
    }
}

function chgLinkedResources(xmlobj, resname, resdir) {
    var ele = xmlutils.findElement(xmlobj, 'projectDescription>linkedResources>link>name=' + resname);
    if (ele == null) {
        addLinkedResources(xmlobj, resname, resdir);

        return ;
    }

//    console.log(resname + ' ' + resdir);

    var location = xmlutils.findChild(ele.parentNode, 'location');
    if (location != null) {
        xmlutils.removeElement(location);
    }

    var locationURI = xmlutils.findChild(ele.parentNode, 'locationURI');
    if (locationURI != null) {
        xmlutils.chgValue(locationURI, resdir);
    }
    else {
        xmlutils.appendTextNode(xmlutils.appendElement(ele.parentNode, 'locationURI'), resdir);
    }
    //
    //if (findLinkedResources(xmlobj, resname)) {
    //    return ;
    //}
    //
    //var root = xmlobj.documentElement;
    //if (root.nodeName == 'projectDescription') {
    //    var linkroot = xmlutils.findChild(root, 'linkedResources');
    //    if (linkroot != null) {
    //        var link = xmlutils.appendElement(linkroot, 'link');
    //
    //        xmlutils.appendTextNode(xmlutils.appendElement(link, 'name'), resname);
    //        xmlutils.appendTextNode(xmlutils.appendElement(link, 'type'), '2');
    //        xmlutils.appendTextNode(xmlutils.appendElement(link, 'locationURI'), resdir);
    //    }
    //}
}

function removeProject(xmlobj, projname) {
    var root = xmlobj.documentElement;
    if (root.nodeName == 'projectDescription') {
        var projs = xmlutils.findChild(root, 'projects');
        if (projs != null) {
            var val = xmlutils.findChildValue(projs, 'project', projname);
            xmlutils.removeElement(val);
        }
    }
}

function loadClassPathXML(projpath) {
    var filename = path.join(projpath, '.classpath');
    return xmlutils.loadxmlSync(filename);
}

function saveClassPathXML(projpath, xmlobj) {
    var filename = path.join(projpath, '.classpath');

    xmlutils.save2xmlSync(filename, xmlobj);
}

function findClassPath(xmlobj, curpath) {
    var ele = xmlutils.findElement(xmlobj, 'classpath>classpathentry|path=' + curpath);
    if (ele == null) {
        return false;
    }

    return true;

    var root = xmlobj.documentElement;
    if (root.nodeName == 'classpath') {
        if (root.hasChildNodes()) {

            var nums = root.childNodes.length;
            var childs = root.childNodes;

            for (var i = 0; i < nums; ++i) {
                var curnode = childs[i];
                if (curnode.hasOwnProperty('attributes')) {
                    var attrpath = xmlutils.findAttr(curnode, 'path');
                    if (attrpath == curpath) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

function addClassPath(xmlobj, curpath) {
    if (findClassPath(xmlobj, curpath)) {
        return ;
    }

    var root = xmlobj.documentElement;
    if (root.nodeName == 'classpath') {
        var node = xmlutils.appendElement(root, 'classpathentry');
        node.setAttribute('kind', 'src');
        node.setAttribute('path', curpath);
    }
}

function insAndroidMK(projpath, info1, info2) {
    var filename = path.join(projpath, 'jni', 'Android.mk');
    ndkprojutils.insAndroidMK(filename, info1, info2);
}

function getMainActivity(projpath) {
    var filename = path.join(projpath, 'AndroidManifest.xml');
    return amxmlutils.getMainActivity(filename);
}

function chgPkgName(projpath, pkgname) {
    var filename = path.join(projpath, 'AndroidManifest.xml');
    return amxmlutils.chgPkgName(filename, pkgname);
}

function createADTProj(workspace, destdir, projname, callback) {
    var destpath = path.join(workspace, '.metadata/.plugins/org.eclipse.core.resources/.projects', projname);
    fileutils.copyFileOrDir('adtproj', destpath, function () {
        var beginname = path.join(destpath, '__begin.location');
        var endname = path.join(destpath, '__end.location');
        var destname = path.join(destpath, '.location');

        var begin = fs.readFileSync(beginname);
        var end = fs.readFileSync(endname);

        fs.writeFileSync(destname, begin);

        var buff = new Buffer(destdir.length + 1);
        buff.writeUInt8(destdir.length, 0);
        buff.write(destdir, 1);
        fs.appendFileSync(destname, buff);
        fs.appendFileSync(destname, end);

        fileutils.delFileOrDirSync(beginname);
        fileutils.delFileOrDirSync(endname);

        callback();
    });
}

function procProj_uemng(destdir, config) {
    fileutils.copyFileOrDir(srcdir, destdir, function () {
        var str = fs.realpathSync('.');
    });
}

function loadCProjXML(projpath) {
    var filename = path.join(projpath, '.cproject');
    return xmlutils.loadxmlSync(filename);
}

function saveCProjXML(projpath, xmlobj) {
    var filename = path.join(projpath, '.cproject');
    xmlutils.save2xmlSync(filename, xmlobj);
}

// .project
exports.loadProjXML = loadProjXML;
exports.saveProjXML = saveProjXML;
exports.chgProjName = chgProjName;
exports.addLinkedResources = addLinkedResources;
exports.chgLinkedResources = chgLinkedResources;
exports.removeProject = removeProject;

// .classpath
exports.loadClassPathXML = loadClassPathXML;
exports.saveClassPathXML = saveClassPathXML;
exports.addClassPath = addClassPath;

// Android.mk
exports.insAndroidMK = insAndroidMK;

// AndroidManifest.xml
exports.getMainActivity = getMainActivity;
exports.chgPkgName = chgPkgName;

// adt workspace
exports.createADTProj = createADTProj;

// .cproject
exports.loadProjXML = loadProjXML;
exports.saveProjXML = saveProjXML;

console.log('load adtprojutils...');