# good-samaritan

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/good-samaritan.svg)](https://npmjs.org/package/good-samaritan)
[![Downloads/week](https://img.shields.io/npm/dw/good-samaritan.svg)](https://npmjs.org/package/good-samaritan)
[![License](https://img.shields.io/npm/l/good-samaritan.svg)](https://github.com/stdavis/good-samaritan/blob/master/package.json)
[![Coverage Status](https://coveralls.io/repos/github/stdavis/good-samaritan/badge.svg?branch=master)](https://coveralls.io/github/stdavis/good-samaritan?branch=master)

Help make the world a better place by finding issues in open source dependencies of your NodeJS project that you can help with.

Requires a GitHub account for rate limits only ([no scopes are requested](src/authentication.js)).

Only issues that are labeled as "help wanted" are shown by default.

## Usage

Run `npx good-samaritan` from the root of any project with a `package.json` file.

Or, alternatively, install this project globally via: `npm install -g good-samaritan` and then run `good-samaritan`.

## Development

### Local installation

`npm link`

Then you should be able to run `good-samaritan` anywhere.

### Debugging in VSCode

1. Set a breakpoint in the editor.
1. Run `Debug: Create JavaScript Debug Terminal`
1. Run `good-samaritan` in the new terminal.

### Cutting a new release

1. `npm run release`
1. `npm publish`
