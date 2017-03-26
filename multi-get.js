'use strict';

/*
 * multi-get.js
 * 
 * MIT License
 * 
 * Copyright (c) 2017 Stephen Legge
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var Main = require('./lib/main');

var yargs = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('multi-get', 'Get multiple blocks of a file from the internet')
    .example('$0 multi-get --url <url>', 'Get multiple blocks of the given url')

    .alias('u', 'url')
    .nargs('u', 1)
    .describe('u', 'url of a file to download from')

    .alias('c', 'count')
    .default('c', 4)
    .nargs('c', 1)
    .describe('c', 'number of blocks to download')

    .alias('d', 'destination')
    .default('d', 'multi-get.dest')
    .nargs('d', 1)
    .describe('d', 'destination filename')
    
    .demandOption(['u'])
    .help('h')
    .alias('h', 'help')
    .epilog('Copyright Stephen Legge 2017');

function runMain(args) {
    var main = new Main(args);
    main.multiGet();
}

var argv = yargs.argv;
if (argv._.length >= 1) {
    switch (argv._[0]) {
        case 'multi-get':
            runMain(argv);
            break;
        default:
            yargs.showHelp();
            break;
    }
} else {
    yargs.showHelp();
}
