// PhantomJS script
// Takes screeshot of a given page. This correctly handles pages which
// dynamically load content making AJAX requests.

// Instead of waiting fixed amount of time before rendering, we give a short
// time for the page to make additional requests.

// Phantom internals
var system = require('system');
var webPage = require('webpage');

function main() {
    // I tried to use yargs as a nicer commandline option parser but
    // it doesn't run in phantomjs environment
    var args = system.args;
    var opts = {
        url: args[1],
        filePath: args[2],
        width: args[3],
        height: args[4],
        requestTimeout: args[5],
        maxTimeout: args[6],
        verbose: args[7] === 'true',
        fileType: args[8],
        fileQuality: args[9] ? args[9] : 100,
        cropWidth: args[10],
        cropHeight: args[11],
        cropOffsetLeft: args[12] ? args[12] : 0,
        cropOffsetTop: args[13] ? args[13] : 0
    };

    renderPage(opts);
}

function renderPage(opts) {
    var requestCount = 0;
    var forceRenderTimeout;
    var dynamicRenderTimeout;

    var sinriGuessTimeCost = 0;

    var page = webPage.create();
    page.viewportSize = {
        width: opts.width,
        height: opts.height
    };
    // Silence confirmation messages and errors
    page.onConfirm = page.onPrompt = function noOp() {};
    page.onError = function(err) {
        log('Page error:', err);
    };

    page.onResourceRequested = function(request) {
        log('->', request.method, request.url);
        requestCount += 1;
        clearTimeout(dynamicRenderTimeout);
    };

    page.onResourceReceived = function(response) {
        if (!response.stage || response.stage === 'end') {
            log('<-', response.status, response.url);
            requestCount -= 1;
            if (requestCount === 0) {
                guessTime(opts.requestTimeout);
                //clearTimeout(dynamicRenderTimeout);
                dynamicRenderTimeout = setTimeout(function () {
                        log("CAUSED BY onResourceReceived requestTimeout for url ", response.url, opts.requestTimeout);
                        renderAndExit();
                    },
                    opts.requestTimeout
                );
            }
        }
    };

    page.open(opts.url, function(status) {
        if (status !== 'success') {
            log('Unable to load url:', opts.url);
            phantom.exit(10);
        } else {
            // scroll
            page.evaluate(function () {
                // 这个就是为了防止被滚动延迟加载的坑
                //document.body.scrollTop=10000;
                window.scrollTo(0, 5000);
            });

            guessTime(opts.maxTimeout);
            forceRenderTimeout = setTimeout(function () {
                log("CAUSED BY open maxTimeout", opts.maxTimeout);
                renderAndExit();
            }, opts.maxTimeout);
        }
    });

    function log() {
        // PhangomJS doesn't stringify objects very well, doing that manually
        if (opts.verbose) {
            var args = Array.prototype.slice.call(arguments);

            var str = '';
            args.forEach(function(arg) {
                if (isString) {
                    str += arg;
                } else {
                    str += JSON.stringify(arg, null, 2);
                }

                str += ' '
            });

            var str_date = (new Date());

            console.log("[" + str_date + "] " + str);
        }
    }

    function guessTime(newDelay) {
        sinriGuessTimeCost = Math.max(new Date().getTime() * 1 + newDelay * 1, sinriGuessTimeCost);
        log("Now guess end time to be ", sinriGuessTimeCost, new Date(sinriGuessTimeCost));
    }

    function renderAndExit() {
        log('Render screenshot..');
        if(opts.cropWidth && opts.cropHeight) {
        log("Cropping...");
            page.clipRect = {top: opts.cropOffsetTop, left: opts.cropOffsetLeft, width: opts.cropWidth, height: opts.cropHeight};
        }

        var renderOpts = {
            fileQuality: opts.fileQuality
        };

        if(opts.fileType) {
            log("Adjusting File Type...");
            renderOpts.fileType = opts.fileType;
        }

        page.render(opts.filePath, renderOpts);
        log('Done.');
        phantom.exit();
    }
}

function isString(value) {
    return typeof value == 'string'
}

main();
