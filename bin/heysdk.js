#!/usr/bin/env node

var console = require('console');
var cmdparser = require('../cmdparser');

var argv = process.argv.splice(2);

var str = cmdparser.parse(argv);

console.log(str);