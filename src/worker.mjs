import {argon2id} from './argon2-wasm.mjs'

export default {
  // https://developers.cloudflare.com/workers/runtime-apis/fetch-event#syntax-module-worker
  async fetch(request, env, context) {
    const searchParams = new URL(request.url).searchParams

    const t = parseInt(searchParams.get('t')) || 2
    const mKiB = parseInt(searchParams.get('mKiB')) || 15*1024
    const p = parseInt(searchParams.get('p')) || 1
    const hashLength = parseInt(searchParams.get('hashLength')) || 32

    const password = searchParams.get('password') || 'mypassword'
    const salt = new TextEncoder().encode(searchParams.get('salt') || 'mysalt')

    const hash = await argon2id(t, mKiB, p, password, salt, hashLength)
    return new Response(hash)
  }
}
