/* global $ */
'use strict';

module.exports = function () {
    return {
        gotoUrl: gotoUrl,
        getHeader: getHeader,
        takeScreenshotIfFail: takeScreenshotIfFail,
        expectUrlToMatch: expectUrlToMatch
    };

    //////////

    function gotoUrl (url) {
        browser.get(browser.baseUrl + '/' + url);
    }

    function getHeader () {
        return {
            'title': $('.header-title > a'),
            'loginBtn': $('.header-login'),
            'userName': $('.header-user-name'),
            'dropdown': $('.header-dropdown'),
            'dropdownToggle': $('.dropdown-toggle'),
            'dropdownMenu': $('.header-dropdown-menu'),
            'logoutLink': $('.logout-link')
        };
    }

    function takeScreenshotIfFail () {
        var fs = require('fs');
        var currentSpec = jasmine.getEnv().currentSpec;
        var passed = currentSpec.results().passed();
        if (!passed) {
            browser.takeScreenshot().then(function (png) {
                browser.getCapabilities().then(function (capabilities) {
                    var browserName = capabilities.caps_.browserName;
                    var filename = browserName + '-' +
                        currentSpec.description.replace(/[ :]/g, '-') + '.png';
                    try {
                        fs.mkdirSync(browser.params.screenshotDir);
                    } catch (e) {
                        console.log(e);
                    }
                    var stream = fs.createWriteStream(browser.params.screenshotDir + filename);
                    stream.on('open', function () {
                        stream.write(new Buffer(png, 'base64'));
                    });
                });
            });
        }
    }

    function expectUrlToMatch (url) {
        expect(browser.getCurrentUrl()).toMatch(new RegExp(url));
    }

};
