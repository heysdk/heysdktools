/**
 * Created by zhs007 on 15/3/5.
 */

var fileutils = require('heyutils').fileutils;
var strutils = require('heyutils').strutils;
var path = require('path');
var fs = require('fs');
var util = require('util');
var xcode = require('./lib/xcode/index');

var COMMENT_KEY = /_comment$/;

function clearProj(xcodeproj) {
    var dir = path.join(xcodeproj, 'xcuserdata');
    fileutils.delFileOrDirSync(dir);

    dir = path.join(xcodeproj, 'project.xcworkspace');
    fileutils.delFileOrDirSync(dir);
}

function chgProjName(ppath, srcname, destname, callback) {
    var srcdir = path.join(ppath, srcname + '.xcodeproj');
    var destdir = path.join(ppath, destname + '.xcodeproj');
    fileutils.copyFileOrDir(srcdir, destdir, function (isok) {
        fileutils.delFileOrDirSync(srcdir);

        var pbxfile = path.join(destdir, 'project.pbxproj');

        var str = fs.readFileSync(pbxfile).toString();

        var srcstr = '"' + srcname + '"';
        var deststr = '"' + destname + '"';
        str = str.replace(new RegExp(srcstr, 'g'), deststr);

        srcstr = ' ' + srcname + ' iOS.app ';
        deststr = ' ' + destname + ' iOS.app ';
        str = str.replace(new RegExp(srcstr, 'g'), deststr);

        srcstr = ' ' + srcname + ' Mac.app ';
        deststr = ' ' + destname + ' Mac.app ';
        str = str.replace(new RegExp(srcstr, 'g'), deststr);

        srcstr = '"' + srcname + ' iOS.app"';
        deststr = '"' + destname + ' iOS.app"';
        str = str.replace(new RegExp(srcstr, 'g'), deststr);

        srcstr = '"' + srcname + ' Mac.app"';
        deststr = '"' + destname + ' Mac.app"';
        str = str.replace(new RegExp(srcstr, 'g'), deststr);

        srcstr = ' ' + srcname + ' iOS ';
        deststr = ' ' + destname + ' iOS ';
        str = str.replace(new RegExp(srcstr, 'g'), deststr);

        srcstr = '"' + srcname + ' iOS"';
        deststr = '"' + destname + ' iOS"';
        str = str.replace(new RegExp(srcstr, 'g'), deststr);

        srcstr = ' ' + srcname + ' Mac ';
        deststr = ' ' + destname + ' Mac ';
        str = str.replace(new RegExp(srcstr, 'g'), deststr);

        srcstr = '"' + srcname + ' Mac"';
        deststr = '"' + destname + ' Mac"';
        str = str.replace(new RegExp(srcstr, 'g'), deststr);

        fs.writeFileSync(pbxfile, str);

        callback();

        //var workspacefile = path.join(destdir, 'project.xcworkspace', 'contents.xcworkspacedata');
        //
        //var str = fs.readFileSync(workspacefile).toString();
        //
        //srcstr = '"self:' + srcname + '.xcodeproj"';
        //deststr = '"self:' + destname + '.xcodeproj"';
        //str = str.replace(new RegExp(srcstr, 'g'), deststr);
        //
        //fs.writeFileSync(workspacefile, str);
    });
}

function loadSync(xcodeproj) {
    var projfilename = path.join(xcodeproj, 'project.pbxproj');
    var proj = xcode.project(projfilename);
    proj.parseSync();
    return proj;
}

function saveSync(xcodeproj, proj) {
    var projfilename = path.join(xcodeproj, 'project.pbxproj');
    fs.writeFileSync(projfilename, proj.writeSync());
}

function addFrameworkFile(proj, filename, group) {
    if (hasPbxFileReferenceSection(proj, filename)) {
        return ;
    }

    var pbxfile = new xcode.pbxFile(filename);
    pbxfile.fileRef = proj.generateUuid();
    proj.addToPbxFileReferenceSection(pbxfile);    // PBXFileReference

    pbxfile.uuid = proj.generateUuid();
    proj.addToPbxBuildFileSection(pbxfile);        // PBXBuildFile

    addFrameworksBuildPhase(proj, pbxfile);
    addFile2Group(proj, pbxfile, group);
}

function hasPbxFileReferenceSection(proj, filename) {
    var basename = path.basename(filename);
    var section = proj.hash.project.objects['PBXFileReference'];
    for (var key in section) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (section[key] == basename) {
            return true;
        }
    }

    return false;
}

function addSourceFile(proj, filename, group) {
    if (hasPbxFileReferenceSection(proj, filename)) {
        return ;
    }

    var pbxfile = new xcode.pbxFile(filename);
    pbxfile.group = 'Sources';
    procPbxFile(pbxfile);
    pbxfile.fileRef = proj.generateUuid();
    proj.addToPbxFileReferenceSection(pbxfile);    // PBXFileReference

    pbxfile.uuid = proj.generateUuid();
    proj.addToPbxBuildFileSection(pbxfile);        // PBXBuildFile

    addSourcesBuildPhase(proj, pbxfile);
    addFile2Group(proj, pbxfile, group);
}

function addSourceFileEx(proj, filename, objGroup) {
    if (hasPbxFileReferenceSection(proj, filename)) {
        return ;
    }

    var pbxfile = new xcode.pbxFile(filename);
    pbxfile.group = 'Sources';
    procPbxFile(pbxfile);
    pbxfile.fileRef = proj.generateUuid();
    proj.addToPbxFileReferenceSection(pbxfile);    // PBXFileReference

    pbxfile.uuid = proj.generateUuid();
    proj.addToPbxBuildFileSection(pbxfile);        // PBXBuildFile

    addSourcesBuildPhase(proj, pbxfile);
    addFile2GroupEx(proj, pbxfile, objGroup);
}

function addHeaderFile(proj, filename, group) {
    if (hasPbxFileReferenceSection(proj, filename)) {
        return ;
    }

    var pbxfile = new xcode.pbxFile(filename);
    pbxfile.group = 'Sources';
    procPbxFile(pbxfile);
    pbxfile.fileRef = proj.generateUuid();
    proj.addToPbxFileReferenceSection(pbxfile);    // PBXFileReference

    pbxfile.uuid = proj.generateUuid();
    proj.addToPbxBuildFileSection(pbxfile);        // PBXBuildFile

    //addSourcesBuildPhase(proj, pbxfile);
    addFile2Group(proj, pbxfile, group);
}

function addLibraryFileEx(proj, filename, objGroup) {
    if (hasPbxFileReferenceSection(proj, filename)) {
        return ;
    }

    var pbxfile = new xcode.pbxFile(filename);
    //pbxfile.group = 'Sources';
    //procPbxFile(pbxfile);
    delete pbxfile.fileEncoding;
    var name = pbxfile.name;
    delete pbxfile.name;
    pbxfile.fileRef = proj.generateUuid();
    proj.addToPbxFileReferenceSection(pbxfile);    // PBXFileReference

    pbxfile.name = name;
    pbxfile.uuid = proj.generateUuid();
    proj.addToPbxBuildFileSection(pbxfile);        // PBXBuildFile

    addFrameworksBuildPhase(proj, pbxfile);
    addFile2GroupEx(proj, pbxfile, objGroup);
}

function addFrameworkFileEx(proj, filename, objGroup, target) {
    if (hasPbxFileReferenceSection(proj, filename)) {
        return ;
    }

    var uuid = proj.generateUuid();
    var pbxfile = addLibrary(proj, filename, uuid, target);
    //var pbxfile = new xcode.pbxFile(filename);
    pbxfile.fileRef = uuid;
    proj.addToPbxFileReferenceSection(pbxfile);    // PBXFileReference
    //
    //pbxfile.uuid = proj.generateUuid();
    //proj.addToPbxBuildFileSection(pbxfile);        // PBXBuildFile
    //
    //addFrameworksBuildPhase(proj, pbxfile);
    addFile2GroupEx(proj, pbxfile, objGroup);
}

function addOtherFrameworkFileEx(proj, filename, objGroup, target) {
    if (hasPbxFileReferenceSection(proj, filename)) {
        return ;
    }

    var uuid = proj.generateUuid();
    var pbxfile = addLibrary(proj, filename, uuid, target);
    //var pbxfile = new xcode.pbxFile(filename);
    //delete pbxfile.basename;
    pbxfile.fileRef = uuid;
    pbxfile.path = filename;
    pbxfile.sourceTree = '"<group>"';

    proj.hash.project.objects['PBXFileReference'][uuid] = {
        isa: 'PBXFileReference',
        lastKnownFileType: 'wrapper.framework',
        path: util.format('"%s"', pbxfile.basename),
        sourceTree: '"<group>"'
    };
    proj.hash.project.objects['PBXFileReference'][uuid + '_comment'] = pbxfile.basename;
    //proj.addToPbxFileReferenceSection(pbxfile);    // PBXFileReference
    //
    //pbxfile.uuid = proj.generateUuid();
    //proj.addToPbxBuildFileSection(pbxfile);        // PBXBuildFile
    //
    //addFrameworksBuildPhase(proj, pbxfile);
    addFile2GroupEx(proj, pbxfile, objGroup);
}

function addResourceFileEx(proj, filename, objGroup, target) {
    if (hasPbxFileReferenceSection(proj, filename)) {
        return ;
    }

    var uuid = proj.generateUuid();
    var pbxfile = addResource(proj, filename, uuid, target);
    //var pbxfile = new xcode.pbxFile(filename);
    pbxfile.fileRef = uuid;
    proj.addToPbxFileReferenceSection(pbxfile);    // PBXFileReference
    //
    //pbxfile.uuid = proj.generateUuid();
    //proj.addToPbxBuildFileSection(pbxfile);        // PBXBuildFile
    //
    //addFrameworksBuildPhase(proj, pbxfile);
    addFile2GroupEx(proj, pbxfile, objGroup);
}

function addHeaderFileEx(proj, filename, objGroup) {
    if (hasPbxFileReferenceSection(proj, filename)) {
        return ;
    }

    var pbxfile = new xcode.pbxFile(filename);
    pbxfile.group = 'Sources';
    procPbxFile(pbxfile);
    pbxfile.fileRef = proj.generateUuid();
    proj.addToPbxFileReferenceSection(pbxfile);    // PBXFileReference

    pbxfile.uuid = proj.generateUuid();
    proj.addToPbxBuildFileSection(pbxfile);        // PBXBuildFile

    //addSourcesBuildPhase(proj, pbxfile);
    addFile2GroupEx(proj, pbxfile, objGroup);
}

function addFile2GroupEx(proj, pbxfile, objGroup) {
    var obj = Object.create(null);

    obj.value = pbxfile.fileRef;
    obj.comment = pbxfile.basename;

    objGroup.children.push(obj);
}

function addFile2Group(proj, pbxfile, group) {
    var obj = Object.create(null);

    obj.value = pbxfile.fileRef;
    obj.comment = pbxfile.basename;

    var objGroup = proj.pbxGroupByName(group);
    objGroup.children.push(obj);
}

function addSourcesBuildPhase(proj, pbxfile) {
    var obj = Object.create(null);

    obj.value = pbxfile.uuid;
    obj.comment = util.format("%s in %s", pbxfile.basename, pbxfile.group);

    var section = proj.hash.project.objects['PBXSourcesBuildPhase'];
    for (var key in section) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (section[key] == pbxfile.group) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            section[sectionKey].files.push(obj);
        }
    }
}

function addFrameworksBuildPhase(proj, pbxfile) {
    var obj = Object.create(null);

    obj.value = pbxfile.uuid;
    obj.comment = util.format("%s in %s", pbxfile.basename, pbxfile.group);

    var section = proj.hash.project.objects['PBXFrameworksBuildPhase'];
    for (var key in section) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (section[key] == pbxfile.group) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            section[sectionKey].files.push(obj);
        }
    }
}

function procPbxFile(pbxfile) {
    if (pbxfile.lastType == 'unknown') {
        var CPP_EXTENSION = /[.]cpp$/, CPP_FILE = 'sourcecode.c.cpp',
            C_EXTENSION = /[.]c$/, C_FILE = 'sourcecode.c.c',
            HPP_EXTENSION = /[.]hpp$/, HPP_FILE = 'sourcecode.c.hpp',
            XCODEPROJ_EXTENSION = /[.]xcodeproj$/, XCODEPROJ_FILE = 'wrapper.pb-project';

        if (CPP_EXTENSION.test(pbxfile.basename))
            pbxfile.lastType = CPP_FILE;
        else if (C_EXTENSION.test(pbxfile.basename))
            pbxfile.lastType = C_FILE;
        else if (HPP_EXTENSION.test(pbxfile.basename))
            pbxfile.lastType = HPP_FILE;
        else if (XCODEPROJ_EXTENSION.test(pbxfile.basename))
            pbxfile.lastType = XCODEPROJ_FILE;
    }

    return pbxfile;
}

function findChildGroupUUID(proj, group, parentuuid) {
    var groups = proj.hash.project.objects['PBXGroup'];

    for (var key in groups) {
        if (key == parentuuid) {
            var curgroup = groups[parentuuid];

            for (var i = 0; i < curgroup.children.length; ++i) {
                if (curgroup.children[i].comment == group) {
                    return curgroup.children[i].value;
                }
            }
        }
    }

    return null;
}

function getGroupWithUUID(proj, uuid) {
    var groups = proj.hash.project.objects['PBXGroup'];

    for (var key in groups) {
        if (key == uuid) {
            return groups[uuid];
        }
    }

    return null;
}

function getGroupUUID(proj, group) {
    var groups = proj.hash.project.objects['PBXGroup'],
        key, groupKey;

    for (key in groups) {
        // only look for comments
        if (!COMMENT_KEY.test(key)) continue;

        if (groups[key] == group) {
            groupKey = key.split(COMMENT_KEY)[0];
            return groupKey;
        }
    }

    return null;
}

function findGroupUUID(proj, grouppath) {
    var arr = strutils.splitPath(grouppath);
    var groupuuid = getGroupUUID(proj, 'CustomTemplate');
    for (var i = 0; i < arr.length; ++i) {
        groupuuid = findChildGroupUUID(proj, arr[i], groupuuid);
        if (groupuuid == null) {
            return null;
        }
    }

    return groupuuid;
}

function addGroup(proj, group, destpath, groupparentpath) {
    if (groupparentpath == undefined) {
        groupparentpath = '';
    }

    var parentuuid = findGroupUUID(proj, groupparentpath);
    if (parentuuid == null) {
        return null;
    }

    var groups = proj.hash.project.objects['PBXGroup'];

    var uuid = proj.generateUuid();

    var obj = Object.create(null);

    obj.name = group;
    obj.children = [];
    obj.isa = 'PBXGroup';
    obj.path = destpath;
    obj.sourceTree = '"<group>"';

    groups[uuid] = obj;
    groups[uuid + '_comment'] = group;

    var obj1 = Object.create(null);

    obj1.value = uuid;
    obj1.comment = group;

    var objGroup = getGroupWithUUID(proj, parentuuid);
    for (var i = 0; i < objGroup.children.length; ++i) {
        if (objGroup.children[i].comment == group) {
            return objGroup.children[i].value;
        }
    }
    objGroup.children.push(obj1);

    return uuid;
}

function addGroupChildProj(proj, childproj, lst) {
    var groups = proj.hash.project.objects['PBXGroup'];

    var uuid = proj.generateUuid();

    var obj = Object.create(null);

    obj.name = 'Products';
    obj.children = [];
    obj.isa = 'PBXGroup';
    obj.sourceTree = '"<group>"';

    for (var i = 0; i < lst.length; ++i) {
        obj.children.push(lst[i]);
    }

    groups[uuid] = obj;
    groups[uuid + '_comment'] = 'Products';

    return uuid;
}

function hasContainerItemProxy(proj, basename, proxyType, remoteInfo) {
    var itemproxy = proj.hash.project.objects['PBXContainerItemProxy'];
    for (var key in itemproxy) {
        if (COMMENT_KEY.test(key)) {
            continue;
        }

        if (itemproxy[key].containerPortal_comment == basename &&
            itemproxy[key].proxyType == proxyType &&
            itemproxy[key].remoteInfo == remoteInfo) {
            return true;
        }
    }

    return false;
}

function addLibrary(proj, afile, fileRef, target) {
    var pbxfile = new xcode.pbxFile(afile);
    procPbxFile(pbxfile);
    pbxfile.fileRef = fileRef;
    delete pbxfile.fileEncoding;

    pbxfile.uuid = proj.generateUuid();
    proj.addToPbxBuildFileSection(pbxfile);        // PBXBuildFile

    var nativetarget = proj.hash.project.objects['PBXNativeTarget'];
    for (var key in nativetarget) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (nativetarget[key] == target) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            var buildphases = nativetarget[sectionKey].buildPhases;
            for (var i = 0; i < buildphases.length; ++i) {
                if (buildphases[i].comment == 'Frameworks') {
                    var curframeworksuuid = buildphases[i].value;

                    var frameworks = proj.hash.project.objects['PBXFrameworksBuildPhase'][curframeworksuuid];
                    var curcomment = afile + ' in Frameworks';
                    for (var j = 0; j < frameworks.files.length; ++j) {
                        if (frameworks.files[j].comment == curcomment) {
                            return pbxfile;
                        }
                    }

                    frameworks.files.push({comment: curcomment, value: pbxfile.uuid});

                    return pbxfile;
                }
            }
        }
    }

    return pbxfile;
}

function addResource(proj, filename, fileRef, target) {
    var pbxfile = new xcode.pbxFile(filename);
    procPbxFile(pbxfile);
    pbxfile.fileRef = fileRef;
    delete pbxfile.fileEncoding;

    pbxfile.uuid = proj.generateUuid();
    proj.addToPbxBuildFileSection(pbxfile);        // PBXBuildFile

    var nativetarget = proj.hash.project.objects['PBXNativeTarget'];
    for (var key in nativetarget) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (nativetarget[key] == target) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            var buildphases = nativetarget[sectionKey].buildPhases;
            for (var i = 0; i < buildphases.length; ++i) {
                if (buildphases[i].comment == 'Resources') {
                    var curresourceuuid = buildphases[i].value;

                    var resource = proj.hash.project.objects['PBXResourcesBuildPhase'][curresourceuuid];
                    var curcomment = filename + ' in Resources';
                    for (var j = 0; j < resource.files.length; ++j) {
                        if (resource.files[j].comment == curcomment) {
                            return pbxfile;
                        }
                    }

                    resource.files.push({comment: curcomment, value: pbxfile.uuid});

                    return pbxfile;
                }
            }
        }
    }

    return pbxfile;
}

function addTargetDependency(proj, afile, fileRef, target, pbxprojfilename, pbxprojfileRef, libtarget) {
    var nativetarget = proj.hash.project.objects['PBXNativeTarget'];
    for (var key in nativetarget) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (nativetarget[key] == target) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            var dependencies = nativetarget[sectionKey].dependencies;
            var uuid = proj.generateUuid();
            dependencies.push({comment: 'PBXTargetDependency', value: uuid});

            var targetDependency = proj.hash.project.objects['PBXTargetDependency'];
            var A_KEY = /.a$/;
            var basename = key.split(A_KEY)[0];
            var targetproxyuuid = proj.generateUuid();
            targetDependency[uuid] = {isa: 'PBXTargetDependency',
                name: '"' + libtarget + '"',
                targetProxy: targetproxyuuid,
                targetProxy_comment: 'PBXContainerItemProxy'};
            targetDependency[uuid + '_comment'] = 'PBXTargetDependency';

            var itemproxy = proj.hash.project.objects['PBXContainerItemProxy'];
            itemproxy[targetproxyuuid] = {containerPortal: pbxprojfileRef,
                containerPortal_comment: pbxprojfilename,
                isa: 'PBXContainerItemProxy',
                proxyType: 1,
                remoteGlobalIDString: proj.generateUuid(),
                remoteInfo: libtarget};

            itemproxy[targetproxyuuid + '_comment'] = 'PBXContainerItemProxy';
        }
    }
}

function addChildLibProj(proj, projfile, lstafile) {
    if (hasPbxFileReferenceSection(proj, projfile)) {
        return ;
    }

    var pbxfile = new xcode.pbxFile(projfile);
    procPbxFile(pbxfile);
    pbxfile.fileRef = proj.generateUuid();
    delete pbxfile.fileEncoding;

    // PBXFileReference
    proj.addToPbxFileReferenceSection(pbxfile);

    // PBXGroup -> Products
    var lstobj = [];
    for (var i = 0; i < lstafile.length; ++i) {
        var obj1 = Object.create(null);

        obj1.value = proj.generateUuid();
        obj1.comment = lstafile[i].afile;

        lstobj.push(obj1);
    }

    var productsuuid = addGroupChildProj(proj, pbxfile.basename, lstobj);

    // .a to PBXBuildFile
    for (var i = 0; i < lstobj.length; ++i) {
        addLibrary(proj, lstobj[i].comment, lstobj[i].value, lstafile[i].target);
    }

    // PBXGroup -> CustomTemplate
    var obj1 = Object.create(null);
    obj1.value = pbxfile.fileRef;
    obj1.comment = pbxfile.basename;
    var objGroup = proj.pbxGroupByName('CustomTemplate');
    objGroup.children.push(obj1);

    // PBXProject
    var pbxproject = proj.hash.project.objects['PBXProject'];
    for (var key in pbxproject) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (pbxproject[key] == 'Project object') {
            var sectionKey = key.split(COMMENT_KEY)[0];
            pbxproject[sectionKey].projectReferences.push({ProductGroup: productsuuid, ProductGroup_comment: 'Products', ProjectRef: pbxfile.fileRef, ProjectRef_comment: pbxfile.basename});
        }
    }

    // PBXContainerItemProxy
    var itemproxy = proj.hash.project.objects['PBXContainerItemProxy'];
    for (var i = 0; i < lstobj.length; ++i) {
        //var A_KEY = /.a$/;
        var remoteInfo = '"' + lstafile[i].libtarget + '"';//lstobj[i].comment.split(A_KEY)[0];
        if (!hasContainerItemProxy(proj, pbxfile.basename, 2, remoteInfo)) {
            lstobj[i].remoteRef = proj.generateUuid();

            itemproxy[lstobj[i].remoteRef] = {containerPortal: pbxfile.fileRef,
                containerPortal_comment: pbxfile.basename,
                isa: 'PBXContainerItemProxy',
                proxyType: 2,
                remoteGlobalIDString: proj.generateUuid(),
                remoteInfo: remoteInfo};

            itemproxy[lstobj[i].remoteRef + '_comment'] = 'PBXContainerItemProxy';
        }

        //if (!hasContainerItemProxy(proj, pbxfile.basename, 1, remoteInfo)) {
        //    lstobj[i].remoteRef = proj.generateUuid();
        //
        //    itemproxy[lstobj[i].remoteRef] = {containerPortal: pbxfile.fileRef,
        //        containerPortal_comment: pbxfile.basename,
        //        isa: 'PBXContainerItemProxy',
        //        proxyType: 2,
        //        remoteGlobalIDString: proj.generateUuid(),
        //        remoteInfo: remoteInfo};
        //
        //    itemproxy[lstobj[i].remoteRef + '_comment'] = 'PBXContainerItemProxy';
        //}

        addTargetDependency(proj, lstobj[i].comment, lstobj[i].value, lstafile[i].target, pbxfile.basename, pbxfile.fileRef, lstafile[i].libtarget);
    }

    // PBXTargetDependency


    // PBXReferenceProxy
    var referenceproxy = proj.hash.project.objects['PBXReferenceProxy'];
    for (var i = 0; i < lstobj.length; ++i) {

        referenceproxy[lstobj[i].value] = {isa: 'PBXReferenceProxy',
            fileType: 'archive.ar',
            path: lstobj[i].comment,
            remoteRef: lstobj[i].remoteRef,
            remoteRef_comment: 'PBXContainerItemProxy',
            sourceTree: 'BUILT_PRODUCTS_DIR'};

        referenceproxy[lstobj[i].value + '_comment'] = lstobj[i].comment;
    }
}

function add2ProjHeaderSearchPath(proj, path, projname) {
    var configlist = proj.hash.project.objects['XCConfigurationList'];
    for (var key in configlist) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (configlist[key] == util.format('Build configuration list for PBXProject "%s"', projname)) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            var cfgarr = configlist[sectionKey].buildConfigurations;
            for (var i = 0; i < cfgarr.length; ++i) {
                var curuuid = cfgarr[i].value;
                var buildconfig = proj.hash.project.objects['XCBuildConfiguration'];

                for (var key1 in buildconfig) {
                    if (key1 == curuuid) {
                        buildconfig[key1].buildSettings.HEADER_SEARCH_PATHS.push(util.format('"%s"', path));

                        break;
                    }
                }
            }
        }
    }

    //var configurations = nonComments(this.pbxXCBuildConfigurationSection()),
    //    INHERITED = '"$(inherited)"',
    //    config, buildSettings, searchPaths;
    //
    //for (config in configurations) {
    //    buildSettings = configurations[config].buildSettings;
    //
    //    if (unquote(buildSettings['PRODUCT_NAME']) != this.productName)
    //        continue;
    //
    //    if (!buildSettings['HEADER_SEARCH_PATHS']) {
    //        buildSettings['HEADER_SEARCH_PATHS'] = [INHERITED];
    //    }
    //
    //    buildSettings['HEADER_SEARCH_PATHS'].push(searchPathForFile(file, this));
    //}
}

function add2ProjLibrarySearchPath(proj, path, projname) {
    var configlist = proj.hash.project.objects['XCConfigurationList'];
    for (var key in configlist) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (configlist[key] == util.format('Build configuration list for PBXProject "%s"', projname)) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            var cfgarr = configlist[sectionKey].buildConfigurations;
            for (var i = 0; i < cfgarr.length; ++i) {
                var curuuid = cfgarr[i].value;
                var buildconfig = proj.hash.project.objects['XCBuildConfiguration'];

                for (var key1 in buildconfig) {
                    if (key1 == curuuid) {
                        if (util.isArray(buildconfig[key1].buildSettings.LIBRARY_SEARCH_PATHS)) {
                            buildconfig[key1].buildSettings.LIBRARY_SEARCH_PATHS.push(util.format('"%s"', path));
                        }
                        else {
                            var cur = buildconfig[key1].buildSettings.LIBRARY_SEARCH_PATHS;
                            buildconfig[key1].buildSettings.LIBRARY_SEARCH_PATHS = [];
                            if (cur != undefined && cur.length > 0) {
                                buildconfig[key1].buildSettings.LIBRARY_SEARCH_PATHS.push(cur);
                            }
                            buildconfig[key1].buildSettings.LIBRARY_SEARCH_PATHS.push(util.format('"%s"', path));
                        }

                        break;
                    }
                }
            }
        }
    }
}

function add2ProjFrameworkSearchPath(proj, path, projname) {
    var configlist = proj.hash.project.objects['XCConfigurationList'];
    for (var key in configlist) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (configlist[key] == util.format('Build configuration list for PBXProject "%s"', projname)) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            var cfgarr = configlist[sectionKey].buildConfigurations;
            for (var i = 0; i < cfgarr.length; ++i) {
                var curuuid = cfgarr[i].value;
                var buildconfig = proj.hash.project.objects['XCBuildConfiguration'];

                for (var key1 in buildconfig) {
                    if (key1 == curuuid) {
                        if (util.isArray(buildconfig[key1].buildSettings.FRAMEWORK_SEARCH_PATHS)) {
                            buildconfig[key1].buildSettings.FRAMEWORK_SEARCH_PATHS.push(util.format('"%s"', path));
                        }
                        else {
                            var cur = buildconfig[key1].buildSettings.FRAMEWORK_SEARCH_PATHS;
                            buildconfig[key1].buildSettings.FRAMEWORK_SEARCH_PATHS = [];
                            if (cur != undefined && cur.length > 0) {
                                buildconfig[key1].buildSettings.FRAMEWORK_SEARCH_PATHS.push(cur);
                            }
                            buildconfig[key1].buildSettings.FRAMEWORK_SEARCH_PATHS.push(util.format('"%s"', path));
                        }

                        break;
                    }
                }
            }
        }
    }
}

function add2ProjLibrarySearchPathEx(proj, path, targetname) {
    var configlist = proj.hash.project.objects['XCConfigurationList'];
    for (var key in configlist) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (configlist[key] == util.format('Build configuration list for PBXNativeTarget "%s"', targetname)) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            var cfgarr = configlist[sectionKey].buildConfigurations;
            for (var i = 0; i < cfgarr.length; ++i) {
                var curuuid = cfgarr[i].value;
                var buildconfig = proj.hash.project.objects['XCBuildConfiguration'];

                for (var key1 in buildconfig) {
                    if (key1 == curuuid) {
                        if (util.isArray(buildconfig[key1].buildSettings.LIBRARY_SEARCH_PATHS)) {
                            buildconfig[key1].buildSettings.LIBRARY_SEARCH_PATHS.push(util.format('"%s"', path));
                        }
                        else {
                            var cur = buildconfig[key1].buildSettings.LIBRARY_SEARCH_PATHS;
                            buildconfig[key1].buildSettings.LIBRARY_SEARCH_PATHS = [];
                            if (cur != undefined && cur.length > 0) {
                                buildconfig[key1].buildSettings.LIBRARY_SEARCH_PATHS.push(cur);
                            }
                            buildconfig[key1].buildSettings.LIBRARY_SEARCH_PATHS.push(util.format('"%s"', path));
                        }

                        break;
                    }
                }
            }
        }
    }
}

function add2ProjFrameworkSearchPathEx(proj, path, targetname) {
    var configlist = proj.hash.project.objects['XCConfigurationList'];
    for (var key in configlist) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (configlist[key] == util.format('Build configuration list for PBXNativeTarget "%s"', targetname)) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            var cfgarr = configlist[sectionKey].buildConfigurations;
            for (var i = 0; i < cfgarr.length; ++i) {
                var curuuid = cfgarr[i].value;
                var buildconfig = proj.hash.project.objects['XCBuildConfiguration'];

                for (var key1 in buildconfig) {
                    if (key1 == curuuid) {
                        if (util.isArray(buildconfig[key1].buildSettings.FRAMEWORK_SEARCH_PATHS)) {
                            buildconfig[key1].buildSettings.FRAMEWORK_SEARCH_PATHS.push(util.format('"%s"', path));
                        }
                        else {
                            var cur = buildconfig[key1].buildSettings.FRAMEWORK_SEARCH_PATHS;
                            buildconfig[key1].buildSettings.FRAMEWORK_SEARCH_PATHS = [];
                            if (cur != undefined && cur.length > 0) {
                                buildconfig[key1].buildSettings.FRAMEWORK_SEARCH_PATHS.push(cur);
                            }
                            buildconfig[key1].buildSettings.FRAMEWORK_SEARCH_PATHS.push(util.format('"%s"', path));
                        }

                        break;
                    }
                }
            }
        }
    }
}

function add2ProjOtherLinkerFlags(proj, flag, targetname) {
    var configlist = proj.hash.project.objects['XCConfigurationList'];
    for (var key in configlist) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (configlist[key] == util.format('Build configuration list for PBXNativeTarget "%s"', targetname)) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            var cfgarr = configlist[sectionKey].buildConfigurations;
            for (var i = 0; i < cfgarr.length; ++i) {
                var curuuid = cfgarr[i].value;
                var buildconfig = proj.hash.project.objects['XCBuildConfiguration'];

                for (var key1 in buildconfig) {
                    if (key1 == curuuid) {
                        if (buildconfig[key1].buildSettings.OTHER_LDFLAGS != undefined) {
                            if (util.isArray(buildconfig[key1].buildSettings.OTHER_LDFLAGS)) {
                                buildconfig[key1].buildSettings.OTHER_LDFLAGS.push(flag);
                            }
                            else {
                                var cur = buildconfig[key1].buildSettings.OTHER_LDFLAGS;
                                buildconfig[key1].buildSettings.OTHER_LDFLAGS = [];
                                if (cur != undefined && cur.length > 0) {
                                    buildconfig[key1].buildSettings.OTHER_LDFLAGS.push(cur);
                                }
                                buildconfig[key1].buildSettings.OTHER_LDFLAGS.push(flag);
                            }
                        }
                        else {
                            buildconfig[key1].buildSettings.OTHER_LDFLAGS = [];
                            buildconfig[key1].buildSettings.OTHER_LDFLAGS.push(flag);
                        }

                        break;
                    }
                }
            }
        }
    }
}

function add2ProjRunPathSearchPath(proj, path, targetname) {
    var configlist = proj.hash.project.objects['XCConfigurationList'];
    for (var key in configlist) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (configlist[key] == util.format('Build configuration list for PBXNativeTarget "%s"', targetname)) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            var cfgarr = configlist[sectionKey].buildConfigurations;
            for (var i = 0; i < cfgarr.length; ++i) {
                var curuuid = cfgarr[i].value;
                var buildconfig = proj.hash.project.objects['XCBuildConfiguration'];

                for (var key1 in buildconfig) {
                    if (key1 == curuuid) {
                        buildconfig[key1].buildSettings.LD_RUNPATH_SEARCH_PATHS = path;

                        break;
                    }
                }
            }
        }
    }
}

function addMacroDef(proj, mac, targetname) {
    var configlist = proj.hash.project.objects['XCConfigurationList'];
    for (var key in configlist) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (configlist[key] == util.format('Build configuration list for PBXNativeTarget "%s"', targetname)) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            var cfgarr = configlist[sectionKey].buildConfigurations;
            for (var i = 0; i < cfgarr.length; ++i) {
                var curuuid = cfgarr[i].value;
                var buildconfig = proj.hash.project.objects['XCBuildConfiguration'];

                for (var key1 in buildconfig) {
                    if (key1 == curuuid) {
                        buildconfig[key1].buildSettings.GCC_PREPROCESSOR_DEFINITIONS.push(util.format('"%s"', mac));

                        break;
                    }
                }
            }
        }
    }
}

function getProjSection(proj, section) {
    if (proj.hash.project.objects[section] == undefined) {
        proj.hash.project.objects[section] = {};
    }

    return proj.hash.project.objects[section];
}

function addProjSectionChild(proj, section, uuid, childname, childobj) {
    var objSection = getProjSection(proj, section);
    objSection[uuid] = childobj;
    objSection[uuid + '_comment'] = childname;
}

function getFrameworksBuildActionMask(proj, target) {
    var nativetarget = proj.hash.project.objects['PBXNativeTarget'];
    for (var key in nativetarget) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (nativetarget[key] == target) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            var buildPhases = nativetarget[sectionKey].buildPhases;
            for (var i = 0; i < buildPhases.length; ++i) {
                if (buildPhases[i].comment == 'Frameworks') {
                    var uuid = buildPhases[i].value;
                    var frameworks = proj.hash.project.objects['PBXFrameworksBuildPhase'][uuid];
                    return frameworks.buildActionMask;
                }
            }
        }
    }

    return '2147483647';
}

function addEmbedFrameworks(proj, filename, target) {
    var pbxfile = new xcode.pbxFile(filename);
    pbxfile.fileRef = getFileRef(proj, filename);
    pbxfile.uuid = proj.generateUuid();
    pbxfile.group = 'Embed Frameworks';
    pbxfile.path = filename;
    pbxfile.sourceTree = '"<group>"';
    pbxfile.settings = {ATTRIBUTES: ['CodeSignOnCopy', 'RemoveHeadersOnCopy']};

    //proj.hash.project.objects['PBXBuildFile'][pbxfile.uuid] = {
    //    isa: 'PBXBuildFile',
    //    fileRef: pbxfile.fileRef,
    //    fileRef_comment: pbxfile.basename,
    //    settings: {ATTRIBUTES: ['CodeSignOnCopy', 'RemoveHeadersOnCopy']}
    //};
    //proj.hash.project.objects['PBXBuildFile'][pbxfile.uuid + '_comment'] = pbxfile.basename + ' in Embed Frameworks';

    //this.pbxBuildFileSection()[file.uuid] = pbxBuildFileObj(file);
    //this.pbxBuildFileSection()[commentKey] = pbxBuildFileComment(file);
    proj.addToPbxBuildFileSection(pbxfile);        // PBXBuildFile

    var nativetarget = proj.hash.project.objects['PBXNativeTarget'];
    for (var key in nativetarget) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (nativetarget[key] == target) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            var buildPhases = nativetarget[sectionKey].buildPhases;
            for (var i = 0; i < buildPhases.length; ++i) {
                if (buildPhases[i].comment == 'Embed Frameworks') {
                    var uuidembedframeworks = buildPhases[i].value;
                    //if (proj.hash.project.objects['PBXCopyFilesBuildPhase'] != undefined) {
                        var embedframeworks = proj.hash.project.objects['PBXCopyFilesBuildPhase'][uuidembedframeworks];
                        embedframeworks.files.push({value: pbxfile.uuid, comment: filename + ' in Embed Frameworks'});

                        return ;
                    //}
                }
            }

            var embedframeworks = {
                isa: 'PBXCopyFilesBuildPhase',
                buildActionMask: getFrameworksBuildActionMask(proj, target),
                dstPath: '""',
                dstSubfolderSpec: 10,
                files: [{value: pbxfile.uuid, comment: filename + ' in Embed Frameworks'}],
                name: '"Embed Frameworks"',
                runOnlyForDeploymentPostprocessing: 0
            };

            var uuidembedframeworks = proj.generateUuid();
            addProjSectionChild(proj, 'PBXCopyFilesBuildPhase', uuidembedframeworks, 'Embed Frameworks', embedframeworks);

            buildPhases.push({value: uuidembedframeworks, comment: 'Embed Frameworks'});

            return ;
        }
    }
}

function getFileRef(proj, filename) {
    var basename = path.basename(filename);
    var section = proj.hash.project.objects['PBXFileReference'];
    for (var key in section) {
        if (!COMMENT_KEY.test(key)) {
            continue;
        }

        if (section[key] == basename) {
            var sectionKey = key.split(COMMENT_KEY)[0];
            return sectionKey;
        }
    }

    return undefined;
}

exports.clearProj = clearProj;
exports.chgProjName = chgProjName;

exports.loadSync = loadSync;
exports.saveSync = saveSync;

exports.addSourceFile = addSourceFile;
exports.addHeaderFile = addHeaderFile;
exports.addFrameworkFile = addFrameworkFile;
exports.addGroup = addGroup;
exports.addChildLibProj = addChildLibProj;
exports.add2ProjHeaderSearchPath = add2ProjHeaderSearchPath;
exports.add2ProjLibrarySearchPath = add2ProjLibrarySearchPath;
exports.add2ProjLibrarySearchPathEx = add2ProjLibrarySearchPathEx;
exports.add2ProjFrameworkSearchPath = add2ProjFrameworkSearchPath;
exports.add2ProjFrameworkSearchPathEx = add2ProjFrameworkSearchPathEx;
exports.add2ProjOtherLinkerFlags = add2ProjOtherLinkerFlags;
exports.addMacroDef = addMacroDef;
exports.addSourceFileEx = addSourceFileEx;
exports.addHeaderFileEx = addHeaderFileEx;
exports.addLibraryFileEx = addLibraryFileEx;
exports.addFrameworkFileEx = addFrameworkFileEx;
exports.addOtherFrameworkFileEx = addOtherFrameworkFileEx;
exports.addResourceFileEx = addResourceFileEx;
exports.getGroupWithUUID = getGroupWithUUID;
exports.getGroupUUID = getGroupUUID;
exports.addEmbedFrameworks = addEmbedFrameworks;
exports.getFileRef = getFileRef;
exports.add2ProjRunPathSearchPath = add2ProjRunPathSearchPath;

console.log('load xcodeutils...');