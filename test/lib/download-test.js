'use strict';

/*
 * download-test.js
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

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var nock = require('nock');
var Main = require('../../lib/main');
var Download = require('../../lib/download');

describe('Download class', function() {

    context('Download class callbacks', function() {

        it('onRequestComplete callback with no error, no response', function() {
            var main = new Main({count: 4, url: 'http://test.com/url', destination: 'dest.out'});
            var download = new Download(main);

            var callback = sinon.stub();
            
            download.onRequestComplete(undefined, undefined, undefined, callback);
            expect(callback.called).to.equal(true);
        });

        it('onRequestComplete callback with error, no response', function() {
            var main = new Main({count: 4, url: 'http://test.com/url', destination: 'dest.out'});
            var download = new Download(main);

            var callback = sinon.stub();
            
            download.onRequestComplete('error', undefined, undefined, callback);
            expect(callback.called).to.equal(true);
        });

        it('onRequestComplete callback with response, no error', function() {
            var main = new Main({count: 4, url: 'http://test.com/url', destination: 'dest.out'});
            var download = new Download(main);

            var response = {
                statusCode: 206,
                req: {
                    _headers: {
                        'x-part': 5
                    }
                }
            };
            var callback = sinon.stub();
            
            download.onRequestComplete(undefined, response, undefined, callback);
            expect(callback.called).to.equal(true);
        });
        
        it('onAsyncComplete callback with error', function() {
            var main = new Main({count: 4, url: 'http://test.com/url', destination: 'dest.out'});
            var download = new Download(main);

            expect(function() {download.onAsyncComplete('error')}).to.throw(Error);
        });

        it('onAsyncComplete callback no error', function() {
            var main = new Main({count: 4, url: 'http://test.com/url', destination: 'dest.out'});
            var download = new Download(main);

            download.onAsyncComplete();
        });

        it('onAsyncComplete callback integration test', function() {
            var main = new Main({count: 4, url: 'http://f39bf6aa.bwtest-aws.pravala.com/384MB.jar', destination: 'dest.out'});
            var download = new Download(main);

            var callbackStub = sinon.stub();
            var onRequestCompleteStub = sinon.stub(download, 'onRequestComplete').callsFake(function(error, response, body, callback) {
                callback();
            });

            nock('http://f39bf6aa.bwtest-aws.pravala.com')
                .filteringPath(function(path){
                    return '/';
                 })
                .get('/').times(4).reply(206, "OK");

            download.start();
            // TODO: Verify nock
        });

        it('onAsyncComplete destination error', function() {
            var main = new Main({count: 4, url: 'http://f39bf6aa.bwtest-aws.pravala.com/384MB.jar', destination: 'dest.out'});
            var download = new Download(main);

            // TODO: moca/chai unable to catch this Error?
            download.onAsyncComplete(undefined);
        });
    });

    context('Functions', function() {

        it('start with no error', function() {
            var main = new Main({count: 4, url: 'http://test.com/url', destination: 'dest.out'});
            var download = new Download(main);

            var downloadPartStub = sinon.stub(download, 'downloadPart').callsFake(function() {});
            var onAsyncCompleteStub = sinon.stub(download, 'onAsyncComplete').callsFake(function() {});

            download.start();
            expect(downloadPartStub.called).to.equal(true);
            expect(onAsyncCompleteStub.called).to.equal(false);
        });

        it('start with error', function() {
            var main = new Main({count: 4, url: 'http://test.com/url', destination: 'dest.out'});
            var download = new Download(main);

            var downloadPartStub = sinon.stub(download, 'downloadPart').callsFake(function(url, part, callback) {
                callback('err');
            });
            var onAsyncCompleteStub = sinon.stub(download, 'onAsyncComplete').callsFake(function() {});

            download.start();
            expect(downloadPartStub.called).to.equal(true);
            expect(onAsyncCompleteStub.called).to.equal(true);
        });
    });
});
