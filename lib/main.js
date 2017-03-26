'use strict';

/*
 * main.js
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

var validFilename = require('valid-filename');
var validUrl = require('valid-url');
var Download = require('./download');

/**
 * The Main object.  The arguments have been parsed but not validated, this
 * will validate the arguments and then call the downloader.
 */
function Main(args) {

    if (!this.validArguments(args)) {
        throw new Error('Unable to validate command-line arguments, unable to continue.');
    }

    var self = this;
    self._args = args;
    self._download = new Download(this);
}

/**
 * Getter for the url argument.
 */
Main.prototype.getUrl = function() {
    return this._args.url;
};

/**
 * Getter for the count argument.
 */
Main.prototype.getCount = function() {
    return this._args.count;
};

/**
 * Getter for the destination argument.
 */
Main.prototype.getDestination = function() {
    return this._args.destination;
};

/**
 * Validate a valid http uri.
 */
Main.prototype.isValidUrl = function(url) {
    return validUrl.isHttpUri(url);
};

/**
 * Validate that the count is a valid positive number.
 */
Main.prototype.isValidCount = function(count) {
    return !Number.isNaN(count) && count > 0;
};

/**
 * Validate that the destination filename is a valid filename.
 */
Main.prototype.isValidDestination = function(destination) {
    return validFilename(destination);
};

/**
 * Validate all the arguments.
 */
Main.prototype.validArguments = function(args) {
    if (args === undefined) {
        return false;
    }

    return this.isValidUrl(args.url) &&
           this.isValidCount(args.count) &&
           this.isValidDestination(args.destination);
};

Main.prototype.getDownload = function() {
    return this._download;
};

/**
 * Creates the download object and starts the downloading.
 */
Main.prototype.multiGet = function() {
    this.getDownload().start();
};

module.exports = Main;
