/**
 * Created by zhs007 on 2015/1/8.
 */

var console = require('console');
var path = require('path');
var xmlutils = require('./xmlutils');
var ndkprojutils = require('./ndkprojutils');
var amxmlutils = require('./amxmlutils');

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
    var root = xmlobj.documentElement;
    if (root.nodeName == 'projectDescription') {
        var linkroot = xmlutils.findChild(root, 'linkedResources');
        if (linkroot != null) {
            if (linkroot.hasChildNodes()) {

                var nums = linkroot.childNodes.length;
                var childs = linkroot.childNodes;

                for (var i = 0; i < nums; ++i) {
                    var curresname = xmlutils.getChildValue(childs[i], 'name');
                    if (curresname == resname) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
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

function insAndroidMK(projpath, info) {
    var filename = path.join(projpath, 'jni', 'Android.mk');
    ndkprojutils.insAndroidMK(filename, info);
}

function getMainActivity(projpath) {
    var filename = path.join(projpath, 'AndroidManifest.xml');
    return amxmlutils.getMainActivity(filename);
}

exports.loadProjXML = loadProjXML;
exports.saveProjXML = saveProjXML;
exports.chgProjName = chgProjName;
exports.addLinkedResources = addLinkedResources;
exports.removeProject = removeProject;

exports.loadClassPathXML = loadClassPathXML;
exports.saveClassPathXML = saveClassPathXML;
exports.addClassPath = addClassPath;

exports.insAndroidMK = insAndroidMK;

exports.getMainActivity = getMainActivity;