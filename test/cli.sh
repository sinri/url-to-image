#!/bin/sh

mkdir -p cli_test_result

node ../src/index.js \
https://1111.tmall.com \
cli_test_result/cli.png \
--verbose \
--request-timeout=65000 \
--max-timeout=3000000 \
--kill-timeout=6000000 \
--height=8000 \
> cli_test_result/cli.log


# Usage: src/index.js <url> <path> [options]
#
# <url>   Url to take screenshot of
# <path>  File path where the screenshot is saved
#
#
# 选项：
#   --width              Width of the viewport             [string] [默认值: 1280]
#   --height             Height of the viewport             [string] [默认值: 800]
#   --request-timeout    How long in ms do we wait for additional requests after
#                        all initial requests have gotten their response
#                                                           [string] [默认值: 300]
#   --max-timeout        How long in ms do we wait at maximum. The screenshot is
#                        taken after this time even though resources are not
#                        loaded                           [string] [默认值: 10000]
#   --kill-timeout       How long in ms do we wait for phantomjs process to
#                        finish. If the process is running after this time, it is
#                        killed.                         [string] [默认值: 120000]
#   --phantom-arguments  Command line arguments to be passed to phantomjs
#                        process.You must use the format
#                        --phantom-arguments="--version".
#                                    [string] [默认值: "--ignore-ssl-errors=true"]
#   --verbose            If set, script will output additional information to
#                        stdout.                         [boolean] [默认值: false]
#   -h, --help           显示帮助信息                                    [boolean]
#   -v, --version        显示版本号                                      [boolean]

# var defaultOpts = {
#     width: 1280,
#     height: 800,
#     requestTimeout: 300,
#     maxTimeout: 1000 * 10,
#     killTimeout: 1000 * 60 * 2,
#     verbose: false,
#     fileType: false,
#     fileQuality: false,
#     cropWidth: false,
#     cropHeight: false,
#     cropOffsetLeft: 0,
#     cropOffsetTop: 0,
#     phantomArguments: '--ignore-ssl-errors=true'
# };
