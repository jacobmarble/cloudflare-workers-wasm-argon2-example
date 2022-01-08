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
webpack 5.65.0 compiled successfully in 6724 ms
Error: Something went wrong with the request to Cloudflare...
Uncaught Error: Automatic publicPath is not supported in this browser
  at line 0
 [API code: 10021]
```

## Unit Test WASM interface

To unit test the WASM interface with node:

- modify build-wasm.sh
  - replace `-s SINGLE_FILE=0` with `-s SINGLE_FILE=1`
- `npm run test`
