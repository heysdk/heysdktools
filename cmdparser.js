/**
 * Created by zhs007 on 15/2/7.
 */

var initproj = require('./initproj');

function parse(argv) {
    if (argv.length >= 1) {
        if (argv[0] == 'help') {
            return getHelpString('help');
        }
        else if (argv[0] == 'init') {
            if (argv.length == 2) {
                initproj.proc(argv[1]);
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

    return 'please input heysdk command [params]\ncommand can be init help\n';
}

exports.parse = parse;
exports.getHelpString = getHelpString;