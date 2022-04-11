# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.6.1](https://github.com/stdavis/good-samaritan/compare/v1.6.0...v1.6.1) (2022-04-11)

## [1.6.0](https://github.com/stdavis/good-samaritan/compare/v1.5.0...v1.6.0) (2022-04-11)


### Features

* add max issues optional parameter ([2ba2a4a](https://github.com/stdavis/good-samaritan/commit/2ba2a4a9781f3b51a80cda8f791af1f7e41b0a5b)), closes [#13](https://github.com/stdavis/good-samaritan/issues/13)
* add search-sub-deps flag ([e1bc443](https://github.com/stdavis/good-samaritan/commit/e1bc44308850b612b0f30593eda0ef92cf6e81c7))
* add total processing time metric ([9b15a38](https://github.com/stdavis/good-samaritan/commit/9b15a38b50b998051a826da6aff118b35ed5ae94))
* implement recommended octokit plugins throttle and retry ([56d9081](https://github.com/stdavis/good-samaritan/commit/56d9081efbc193dcf21ad9b19f44fe5ffaeaf97b))

## [1.5.0](https://github.com/stdavis/good-samaritan/compare/v1.4.0...v1.5.0) (2021-01-05)

### Features

- add error handling when gathering issues ([d2d0c07](https://github.com/stdavis/good-samaritan/commit/d2d0c07442ac11f0ca92709e5cf4f27236cc608e))
- search sub-dependencies ([f1d0397](https://github.com/stdavis/good-samaritan/commit/f1d0397ec44057a5657804777b5d4651a1fffefd))

## [1.4.0](https://github.com/stdavis/good-samaritan/compare/v1.3.0...v1.4.0) (2020-10-30)

### Features

- add labels optional parameter ([978655e](https://github.com/stdavis/good-samaritan/commit/978655e36b6f09f3e7e9fdd23c891eb6a3b23bbc))

## [1.3.0](https://github.com/stdavis/good-samaritan/compare/v1.2.0...v1.3.0) (2020-10-23)

### Features

- add progress bar for gathering issues process ([c00fbe5](https://github.com/stdavis/good-samaritan/commit/c00fbe50554427d32078da21b188e15055cfd535))

### Bug Fixes

- better issue list formatting ([9ac4245](https://github.com/stdavis/good-samaritan/commit/9ac4245d107e23deb03e559ddb3e2b4e5646db76))
- fix coverage settings ([530d3f6](https://github.com/stdavis/good-samaritan/commit/530d3f6489d65077ed136ea48db79e8b1b6ad6d1))
- leave progress bar and better message ([501903b](https://github.com/stdavis/good-samaritan/commit/501903bfb55b9f16dbb12ebcf877497884e55852))
- move log to debug statement ([c321a08](https://github.com/stdavis/good-samaritan/commit/c321a082c50e134e55504e1c411c7b657c11c43b))
- use pagination to get all issues and optimize search ([61cf89f](https://github.com/stdavis/good-samaritan/commit/61cf89fa7c52fd0c2e2f0800f2499030dea24772))

## [1.2.0](https://github.com/stdavis/good-samaritan/compare/v1.1.0...v1.2.0) (2020-10-08)

### Features

- add --reset-token parameter ([b9c4966](https://github.com/stdavis/good-samaritan/commit/b9c496607e996b957544b392651c7fdde09cfc0d)), closes [#5](https://github.com/stdavis/good-samaritan/issues/5)
- add tests for authorization module ([cf3acf6](https://github.com/stdavis/good-samaritan/commit/cf3acf628d2fc19267d23c66056324beebe8c1b8))

### Bug Fixes

- handle packages without repository urls ([ecca9dd](https://github.com/stdavis/good-samaritan/commit/ecca9dd7c598457f2ad1ec75485c08fc438d6cd2))
- return more friendly url for issues ([570db96](https://github.com/stdavis/good-samaritan/commit/570db9620bce447bf447f0189d6e228f4aa938be))

## [1.1.0](https://github.com/stdavis/good-samaritan/compare/v1.0.0...v1.1.0) (2020-10-07)

### Features

- cache GitHub token in local file system ([7a1768b](https://github.com/stdavis/good-samaritan/commit/7a1768b4568396697aabcece659c6344febac68b)), closes [#5](https://github.com/stdavis/good-samaritan/issues/5)
- implement standard version ([2e445e3](https://github.com/stdavis/good-samaritan/commit/2e445e3d4ec0e8738eb4c087f1f3e11274551ffb))

### Bug Fixes

- actually pass token to octokit auth ([095aef1](https://github.com/stdavis/good-samaritan/commit/095aef15abcd1f843c64344fe34b0d09d6e19bde))
- remove token log to be more secure ([e053565](https://github.com/stdavis/good-samaritan/commit/e053565c97a8b3d35835c735b38a88bc925f6041))
