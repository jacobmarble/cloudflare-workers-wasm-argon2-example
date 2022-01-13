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

% npx wrangler dev
...
👂  Listening on http://127.0.0.1:8787
```

Now query the dev worker

```console
% curl http://127.0.0.1:8787 -s                  
$argon2id$v=19$m=15360,t=2,p=1$bXlzYWx0aXNzYWx0eQ$fHIEV+86G64dk9nVDIM/EOSQG5b6wLHtLxK4Y4gOjpc
```

## Unit Test WASM interface

To unit test the WASM interface with node:

- modify build-wasm.sh
  - replace `-s SINGLE_FILE=0` with `-s SINGLE_FILE=1`
- `npm run test`
