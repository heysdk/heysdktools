/**
 * Created by zhs007 on 15/2/7.
 */

var console = require('console');

var argv = process.argv.splice(2);

console.log('haha heysdk is ok!');

if (argv.length != 1) {
    console.log('please input node makebaseproj-cc3.js proj.csv');

    process.exit(1);
}