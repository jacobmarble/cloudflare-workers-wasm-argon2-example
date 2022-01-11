#!/bin/sh

set -e

cd $(dirname $0)
mkdir -p build

docker run \
  --rm \
  -v $(pwd):/src \
  emscripten/emsdk:3.1.1 \
  emcc \
  --pre-js pre.js \
  -O0 \
  -Iargon2/include \
  -o build/wasm-module.mjs \
  argon2/src/argon2.c argon2/src/core.c argon2/src/encoding.c argon2/src/ref.c argon2/src/thread.c \
  argon2/src/blake2/blake2b.c \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s DYNAMIC_EXECUTION=0 \
  -s ENVIRONMENT=web \
  -s ERROR_ON_UNDEFINED_SYMBOLS=1 \
  -s EXIT_RUNTIME=0 \
  -s EXPORTED_FUNCTIONS=_argon2id_hash_encoded,_argon2id_verify \
  -s EXPORTED_RUNTIME_METHODS=ccall,AsciiToString \
  -s EXPORT_ES6=1 \
  -s EXPORT_NAME=createModule \
  -s FILESYSTEM=0 \
  -s LLD_REPORT_UNDEFINED=1 \
  -s MODULARIZE=1 \
  -s SINGLE_FILE=0 \
  -s TEXTDECODER=0 \
  -s VERBOSE=0 \
  -s WASM=1

sed -i '' 's/import.meta/({})/g' build/wasm-module.mjs
