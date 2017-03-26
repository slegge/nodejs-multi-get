'use strict';

/*
 * main-test.js
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

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Main = require('../../lib/main');

describe('Main class', function() {

    context('Command Line Arguments', function() {

        it('a url should always be set and be a valid http uri ', function() {
            var main = new Main( { _: [ 'multi-get' ],
                  u: 'http://blah.com/x.zip',
                  url: 'http://blah.com/x.zip',
                  count: 4,
                  destination: 'dest.out'
            });

            expect(main.getUrl()).to.equal('http://blah.com/x.zip');
            expect(main.isValidUrl('http://something.com/file.zip')).to.equal('http://something.com/file.zip');
            expect(main.isValidUrl('HTTP://something.com/file.zip')).to.equal('HTTP://something.com/file.zip');
            expect(main.isValidUrl('HttP://something.com/file.zip')).to.equal('HttP://something.com/file.zip');
            expect(main.isValidUrl('')).to.equal(undefined);
            expect(main.isValidUrl('://something.com/file.zip')).to.equal(undefined);
            expect(main.isValidUrl('http: //something.com/file.zip')).to.equal(undefined);
            expect(main.isValidUrl('ftp://something.com/file.zip')).to.equal(undefined);
        });

        it('all arguments need to be validated before starting to download', function() {
            var main = new Main({url: 'http://test.com/url', count: 4, destination: 'dest.out'});

            expect(main.validArguments({url: 'http://test.com/url', count: 4, destination: 'dest.out'})).to.equal(true);
            expect(function() {new Main({})}).to.throw(Error);
            expect(function() {new Main()}).to.throw(Error);
            expect(function() {new Main({url: 'ftp://test.com/url'})}).to.throw(Error);
            expect(function() {new Main({url: 'ftp://test.com/url', count: -1})}).to.throw(Error);
            expect(function() {new Main({url: 'ftp://test.com/url', count: ''})}).to.throw(Error);
            expect(function() {new Main({url: 'ftp://test.com/url', count: 'NaN'})}).to.throw(Error);
        });

        it('the number of chunks to download should always be set and be a positive number ', function() {
            var main = new Main({count: 4, url: 'http://test.com/url', destination: 'dest.out'});

            expect(main.getCount()).to.equal(4);
            expect(main.isValidCount(4)).to.equal(true);
            expect(main.isValidCount(0)).to.equal(false);
            expect(main.isValidCount(-1)).to.equal(false);
            expect(main.isValidCount('')).to.equal(false);
            expect(main.isValidCount('NaN')).to.equal(false);
            expect(main.isValidCount()).to.equal(false);
        });

        it('the destination filename needs to be a valid local filename', function() {
            var main = new Main({count: 4, url: 'http://test.com/url', destination: 'dest.out'});

            expect(main.getDestination()).to.equal('dest.out');
            expect(main.isValidDestination('dest.out')).to.equal(true);
            expect(main.isValidDestination('...')).to.equal(true);
            expect(main.isValidDestination('')).to.equal(false);
            expect(main.isValidDestination(null)).to.equal(false);
            expect(main.isValidDestination('dir/dest.out')).to.equal(false);
            expect(main.isValidDestination('./dest.out')).to.equal(false);
            expect(main.isValidDestination('abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxy' +
                    'zabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuv' +
                    'wxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrs' +
                    'tuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz.out')).to.equal(false);
        });
    });

    context('Functions', function() {

        it('main entry point for the downloader', function() {
            var main = new Main({count: 4, url: 'http://test.com/url', destination: 'dest.out'});
            
            sinon.stub(main, 'getCount').returns(0);
            
            main.multiGet();
        });
    });

});
