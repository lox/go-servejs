module.exports = {
  entry: './hello.js',
  output: {
    filename: './hello.dist.js'
  },
  resolve: {
    alias: {
      'go-servejs': __dirname + "/../../index.js",
      debug: __dirname + "/../../lib/debug.js"
    }
  }
};
