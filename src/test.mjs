import {argon2id, argon2idVerify} from './argon2-wasm.mjs'

const expectHash = '$argon2id$v=19$m=16,t=1,p=1$bXlzYWx0aXNzYWx0eQ$hMZf2OObxcSZC7cNSFDjA6Rgv60lMhOSKa6xEfA5urk'

const gotHash = await argon2id(
  1, 16, 1,
  'mypassword', new TextEncoder().encode('mysaltissalty'),
  32)

const ok = await argon2idVerify(gotHash, 'mypassword')

if (expectHash !== gotHash) {
  console.error(`expected ${expectHash} but got ${gotHash}`)
} else if (!ok) {
  console.error('hash verify failed')
} else {
  console.log('OK!')
}
