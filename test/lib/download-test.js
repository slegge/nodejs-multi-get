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
    });
});
