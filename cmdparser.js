/**
 * Created by zhs007 on 15/2/7.
 */

var initproj = require('./initproj');
var revertproj = require('./revertproj');

function parse(argv) {
    if (argv.length >= 1) {
        if (argv[0] == 'help') {
            return getHelpString('help');
        }
        else if (argv[0] == 'init') {
            if (argv.length == 2) {
                initproj.proc(argv[1]);

                return '';
            }
            else {
                return getHelpString('init');
            }
        }
        else if (argv[0] == 'revert') {
            if (argv.length == 2) {
                revertproj.proc(argv[1]);

                return '';
            }
            else {
                return getHelpString('init');
            }
        }
    }

    return getHelpString('help');
}

function getHelpString(cmd) {
    if (cmd == undefined) {
        cmd = 'help';
    }

    if (cmd == 'init') {
        return 'please input heysdk init proj.csv\n';
    }

    if (cmd == 'revert') {
        return 'please input heysdk revert proj.csv\n';
    }

    return 'please input heysdk command [params]\ncommand can be init revert help\n';
}

exports.parse = parse;
exports.getHelpString = getHelpString;

console.log('load cmdparser...');