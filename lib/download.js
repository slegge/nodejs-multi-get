'use strict';

/*
 * download.js
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
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var request = require('request');
var concat = require('concat-files');

var KILOBYTE = 1024;
var MEGABYTE = KILOBYTE * 1024;

/**
 * The download object handles downloading and saving the file.  The Main
 * object is passed in to get the validated options.
 */
function Download(main) {
    var self = this;
    self._main = main;
}

/**
 * Callback for each part requested to be downloaded.
 * 
 * After each part that is downloaded, or if there is an error for a part this
 * will be called.  Unless there is an error, we don't really have to do
 * anything with it because we're waiting until they're all done.
 */
Download.prototype.onRequestComplete = function(error, response, body, callback) {
    if (error) {
        callback('Error: ' + error);
    }

    if (response) {
        console.log('Part ' + response.req._headers['x-part'] + ' complete.  Response code: ' + response.statusCode);
    } else {
        callback('Unknown error, no response.');
    }

    callback();
};

/**
 * Upon completion or error of the async tasks this function is called.
 * 
 * Async will call this callback if there is an error in any of the tasks, or
 * if they all get completed.  If we check that it is not an error, then we
 * know that all of the parts have been downloaded and saved and we can put
 * them together and be done.
 */
Download.prototype.onAsyncComplete = function(err) {
    if (err) {
        throw new Error(err);
    }
    
    var self = this;

    console.log('All parts are complete...  Saving to ' + self._destination);
    var files = [];
    for (var i = 0; i < self._main.getCount(); ++i) {
        files.push('.tmp.multi-get.part.' + i);
    }

    concat(files, self._main.getDestination(), function(err) {
        if (err) {
            throw new Error(err);
        }

        console.log('Complete, removing temp files');
        files.forEach(function(filepath) {
            fs.unlinkSync(filepath);
        });
    });
};

/**
 * Download one part of the file specified at object creation.
 * 
 * This function downloads one part of the file, the size is pre-set to
 * 1 megabyte as laid out in the requirements, but can easily be changed
 * to a specified amount as another parameter.  The part of the file is
 * piped to a temporary file and then a callback (onRequestComplete) is
 * called to finish off.
 */
Download.prototype.downloadPart = function(url, part, callback) {
    var self = this;

    console.log('Downloading part ' + part);

    var options = {
        url: url,
        headers: {
            'Accept-Language': 'en-GB,en-US,en',
            'Method': 'GET',
            'User-Agent': 'nodejs-multi-get/0.1.0',
            'Range': 'bytes=' + (part * MEGABYTE) + '-' + ((part + 1) * MEGABYTE - 1),
            'x-part': part
        }
    };

    var fileStream = fs.createWriteStream('.tmp.multi-get.part.' + part);

    var req = request(options, function (error, response, body) {
        self.onRequestComplete(error, response, body, callback);
    }).pipe(fileStream);
};

/**
 * Start the download.
 * 
 * By the time this function has been called, the arguments have been checked
 * and are available in handy variables attached to this object.  We are
 * assuming that all requests will be for the _first_ number of parts of the
 * file to be downloaded, this can easily be changed by providing a start
 * for the range, but this was out of scope for this iteration.
 */
Download.prototype.start = function() {
    var self = this;

    var url = this._main.getUrl();
    var count = this._main.getCount();

    if (count > 0) {
        async.each(_.range(0, count), function(part, callback) {
            self.downloadPart(url, part, callback);
        }, function(err) {
            self.onAsyncComplete(err);
        });
    }
};

module.exports = Download;
