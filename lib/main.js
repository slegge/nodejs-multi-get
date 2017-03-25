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

var validUrl = require('valid-url');

function Main(args) {

    if (!this.validArguments(args)) {
        throw new Error('Unable to validate command-line arguments, unable to continue.');
    }

    var self = this;
    self._args = args;
}

Main.prototype.getUrl = function() {
    return this._args.url;
};

Main.prototype.getCount = function() {
    return this._args.count;
};

Main.prototype.isValidUrl = function(url) {
    return validUrl.isHttpUri(url);
};

Main.prototype.isValidCount = function(count) {
    return !Number.isNaN(count) && count > 0;
};

Main.prototype.validArguments = function(args) {
    if (args === undefined) {
        return false;
    }

    return this.isValidUrl(args.url) && this.isValidCount(args.count);
};

module.exports = Main;
