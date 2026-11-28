import { createHash, timingSafeEqual } from 'node:crypto';
import QRCode from 'qrcode';

const inviteIds = ['provenance', 'ifly', 'icube', 'rasterlab'];
const appleInvite = /^https:\/\/testflight\.apple\.com\/join\/[a-zA-Z0-9]+$/;
const platforms = new Set(['ios', 'tvos', 'macos']);

function json(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/friends-and-family/unlock') return json({}, 404);
    if (request.method !== 'POST') return json({}, 405, { Allow: 'POST' });
    if (request.headers.get('Origin') !== url.origin) return json({}, 403);

    const { success } = await env.UNLOCK_LIMIT.limit({
      key: request.headers.get('CF-Connecting-IP') ?? 'local',
    });
    if (!success) return json({}, 429, { 'Retry-After': '60' });
    if (!/^[0-9a-f]{64}$/.test(env.PASSCODE_SHA256 ?? '') || !env.INVITES_JSON) {
      return json({}, 503);
    }

    const passcode = request.headers.get('X-Invite-Code')?.trim().toUpperCase() ?? '';
    if (!/^[A-Z0-9-]{8,64}$/.test(passcode)) return json({}, 401);
    const submitted = createHash('sha256').update(passcode).digest();
    if (!timingSafeEqual(submitted, Buffer.from(env.PASSCODE_SHA256, 'hex'))) return json({}, 401);

    try {
      const configured = JSON.parse(env.INVITES_JSON);
      const configuredInvites = inviteIds.filter((id) => Object.hasOwn(configured, id));
      const invites = await Promise.all(configuredInvites.map(async (id) => {
        const { url, devices } = configured[id];
        if (!appleInvite.test(url) || !Array.isArray(devices) || devices.length === 0 ||
            devices.some((device) => !platforms.has(device))) {
          throw new Error('Invalid invite configuration');
        }
        const svg = await QRCode.toString(url, { type: 'svg', margin: 4 });
        return { id, url, devices, qr: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}` };
      }));
      return json({ invites });
    } catch {
      return json({}, 503);
    }
  },
};
