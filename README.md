# reload-server-webpack-plugin

> Webpack plugin that automatically (re)starts your server between builds.

[![travis build](https://img.shields.io/travis/ericclemmons/reload-server-webpack-plugin.svg)](https://travis-ci.org/ericclemmons/reload-server-webpack-plugin)
[![Coverage Status](https://coveralls.io/repos/ericclemmons/reload-server-webpack-plugin/badge.svg?branch=master&service=github)](https://coveralls.io/github/ericclemmons/reload-server-webpack-plugin?branch=master)
[![version](https://img.shields.io/npm/v/reload-server-webpack-plugin.svg)](http://npm.im/reload-server-webpack-plugin)
[![downloads](https://img.shields.io/npm/dm/reload-server-webpack-plugin.svg)](http://npm-stat.com/charts.html?package=reload-server-webpack-plugin)
[![MIT License](https://img.shields.io/npm/l/reload-server-webpack-plugin.svg)](http://opensource.org/licenses/MIT)

- - -

### Why?

- Remove your dependency on `nodemon`, `forever`, `pm2`, or similar.
- This works better from a "cold start" when your server hasn't been built yet.
- Fewer issues with websockets & hot-module reloading.

### Installation

```shell
$ npm install --save-dev reload-server-webpack-plugin
```

### Usage

Update your `webpack.config.js`:

```js
module.exports = {
  ...
  plugins: [
    new ReloadServerPlugin({
      // Defaults to process.cwd() + "/server.js"
      script: "path/to/server.js",
    }),
  ],
  ...
};
```

### license

> MIT License 2015 © Eric Clemmons
