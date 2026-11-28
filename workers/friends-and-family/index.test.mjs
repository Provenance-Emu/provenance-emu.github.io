import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import worker from './index.mjs';

const origin = 'https://provenance-emu.com';
const invite = 'https://testflight.apple.com/join/TEST0000';
const code = 'DEMO-TEST-CODE';
const env = {
  PASSCODE_SHA256: createHash('sha256').update(code).digest('hex'),
  INVITES_JSON: JSON.stringify({ provenance: { url: invite, devices: ['ios', 'tvos'] } }),
  UNLOCK_LIMIT: { limit: async () => ({ success: true }) },
};

function unlock(options = {}, bindings = env) {
  return worker.fetch(
    new Request(`${origin}/friends-and-family/unlock`, {
      method: 'POST',
      headers: { Origin: origin, 'X-Invite-Code': code },
      ...options,
    }),
    bindings,
  );
}

test('returns approved links and locally generated QR codes only after a valid passcode', async () => {
  const response = await unlock();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  const { invites } = await response.json();
  assert.equal(invites.length, 1);
  assert.equal(invites[0].url, invite);
  assert.deepEqual(invites[0].devices, ['ios', 'tvos']);
  assert.match(Buffer.from(invites[0].qr.split(',')[1], 'base64').toString(), /^<svg /);
});

test('rejects reads, cross-origin requests, incorrect codes, and throttled attempts', async () => {
  const results = await Promise.all([
    unlock({ method: 'GET' }),
    unlock({ headers: { Origin: 'https://other.example', 'X-Invite-Code': code } }),
    unlock({ headers: { Origin: origin, 'X-Invite-Code': 'WRONG-TEST-CODE' } }),
    unlock({}, { ...env, UNLOCK_LIMIT: { limit: async () => ({ success: false }) } }),
  ]);
  assert.deepEqual(results.map((response) => response.status), [405, 403, 401, 429]);
  for (const response of results) assert.deepEqual(await response.json(), {});
});

test('fails closed on unavailable secrets or an invalid invite destination', async () => {
  assert.equal((await unlock({}, { ...env, PASSCODE_SHA256: undefined })).status, 503);
  assert.equal((await unlock({}, { ...env, INVITES_JSON: env.INVITES_JSON.replace('testflight.apple.com', 'example.com') })).status, 503);
});
