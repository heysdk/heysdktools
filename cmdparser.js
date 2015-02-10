/**
 * Created by zhs007 on 15/2/7.
 */

var initproj = require('./initproj');
var revertproj = require('./revertproj');
var clearadtproj = require('./clearadtproj');

function parse(argv) {
    if (argv.length >= 1) {
        if (argv[0] == 'help') {
            return getHelpString('help');
        }
        else if (argv[0] == 'init') {
            return initproj.proc(argv);
        }
        else if (argv[0] == 'revert') {
            return revertproj.proc(argv);
        }
        else if (argv[0] == 'clearadtproj') {
            return clearadtproj.proc(argv);
        }
    }

    return getHelpString('help');
}

function getHelpString() {
    return 'please input heysdk command [params]\ncommand can be init revert help\n';
}

exports.parse = parse;
exports.getHelpString = getHelpString;

console.log('load cmdparser...');