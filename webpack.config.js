const spawn = require('child_process').spawnSync

module.exports = {
  target: ['webworker', 'es2020'],
  entry: './src/worker.mjs',
  output: {
    filename: 'index.mjs',
    path: __dirname + '/worker',
    library: {
      type: 'module',
    },
    chunkFormat: 'module',
  },
  experiments: {
    outputModule: true,
    topLevelAwait: true,
    asyncWebAssembly: true,
  },
  mode: 'none',
  optimization: {
    minimize: false,
  },
  plugins: [
    {
      apply: compiler => {
        compiler.hooks.compilation.tap('emscripten-build', compilation => {
          let result = spawn('./build-wasm.sh', [], {stdio: 'inherit'})
          if (result.status !== 0) {
            compilation.errors.push('emscripten build failed')
          } else {
            console.log('emscripten build complete')
          }
        })
      },
    },
  ],
}
