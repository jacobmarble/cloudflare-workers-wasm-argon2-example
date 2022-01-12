import createModule from '../build/wasm-module.mjs'

const ENCODED_HASH_BUFFER_SIZE = 1024

export async function argon2id(env, t, mKiB, parallelism, password, salt, hashLength) {
  // TODO support parallelism > 1 without threads
  if (typeof password !== 'string' || salt.BYTES_PER_ELEMENT !== 1) {
    throw new Error('invalid arguments')
  }
  const encodedPassword = new TextEncoder().encode(password)
  const wasmModule = await createModule({
    instantiateWasm(info, receiveInstance) {
      const instance = new WebAssembly.Instance(env.WASM_MODULE, info)
      receiveInstance(instance)
      return instance.exports
    },
    // locateFile(path) {
    //   if (path.endsWith('.wasm')) {
    //     return env.WASM_MODULE
    //   }
    //   return path
    // },
  })
  const cEncodedHash = wasmModule._malloc(ENCODED_HASH_BUFFER_SIZE)
  const result = wasmModule.ccall(
    'argon2id_hash_encoded',
    'number',
    [
      'number', 'number', 'number', // t, m, p
      'array', 'number', 'array', 'number', // password, salt
      'number', 'number', 'number', // hash length, encoded hash
    ],
    [
      t, mKiB, parallelism,
      encodedPassword, encodedPassword.length, salt, salt.length,
      hashLength, cEncodedHash, ENCODED_HASH_BUFFER_SIZE,
    ],
  )
  if (result !== 0) {
    throw new Error(`argon2id_hash_encoded failed with code ${result}`)
  }
  const hashString = wasmModule.AsciiToString(cEncodedHash)
  wasmModule._free(cEncodedHash)
  return hashString
}

export async function argon2idVerify(hashString, password) {
  if (typeof hashString !== 'string' || typeof password !== 'string') {
    throw new Error('invalid arguments')
  }
  const encodedPassword = new TextEncoder().encode(password)
  const wasmModule = await createModule()
  const result = wasmModule.ccall(
    'argon2id_verify',
    'number',
    [
      'string', 'array', 'number',
    ],
    [
      hashString, encodedPassword, encodedPassword.length,
    ],
  )
  if (result === -35) {
    return false
  }
  if (result !== 0) {
    throw new Error(`argon2id_verify failed with code ${result}`)
  }
  return true
}
