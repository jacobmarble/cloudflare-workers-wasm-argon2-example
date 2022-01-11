# cloudflare-workers-wasm-argon2-example

The argon2 C library compiled to WebAssembly, in a Cloudflare Worker

## Fetch the argon2 reference library

```console
% git submodule init
Submodule 'argon2' (https://github.com/P-H-C/phc-winner-argon2) registered for path 'argon2'

% git submodule update
Cloning into '/[redacted]/cloudflare-workers-wasm-argon2-example/argon2'...
Submodule path 'argon2': checked out 'f57e61e19229e23c4445b85494dbf7c07de721cb'
```

## Test in Cloudflare Workers

(Docker is used for the emscripten build.)

```console
% npm install
...
found 0 vulnerabilities

% npx webpack
...
webpack 5.65.0 compiled successfully in 7070 ms

% npx wrangler dev
...
webpack 5.65.0 compiled successfully in 6536 ms
👂  Listening on http://127.0.0.1:8787
```

Now query the dev worker

```console
% curl http://127.0.0.1:8787 -o /dev/null -s -w "%{http_code}"
500
```

And check the logs emitted from `wrangler dev`

```console
...
TypeError: Invalid URL string.
...
```

The invalid URL is the URL used to load the WASM file.
Notice `({}).url` -- this is a replacement for `import.meta.url`.
I use `sed` to replace this, in order to mitigate another error,
`Automatic publicPath is not supported in this browser`.

```javascript
  // Use bundler-friendly `new URL(..., ({}).url)` pattern; works in browsers too.
  wasmBinaryFile = new URL('wasm-module.wasm', ({}).url).toString();
```

## Unit Test WASM interface

To unit test the WASM interface with node:

- modify build-wasm.sh
  - replace `-s SINGLE_FILE=0` with `-s SINGLE_FILE=1`
- `npm run test`
