const form = document.querySelector('#beta-unlock');
const code = document.querySelector('#beta-code');
const submit = form.querySelector('button');
const status = document.querySelector('#beta-status');
const section = document.querySelector('#beta-invites');
const cards = [...section.querySelectorAll('[data-beta-app]')];
const agent = navigator.userAgent;
const safari = /Safari/.test(agent) && !/Chrome|Chromium|CriOS|Edg|FxiOS|OPR/.test(agent);
const ios = /iPhone|iPad|iPod/.test(agent) || (/Macintosh/.test(agent) && navigator.maxTouchPoints > 1);
const mac = /Macintosh/.test(agent) && !ios;
const platformLabels = { ios: 'iPhone and iPad', tvos: 'Apple TV', macos: 'Mac' };
const allowedInvite = /^https:\/\/testflight\.apple\.com\/join\/[a-zA-Z0-9]+$/;

document.querySelector('#beta-device-tip').textContent = ios
  ? safari
    ? 'Tap Open in TestFlight. If Apple shows a page first, tap View in TestFlight.'
    : 'If the invite stays in this browser, open it in Safari and tap View in TestFlight.'
  : mac
    ? 'For an iPhone or Apple TV beta, scan the QR code with your iPhone or email yourself the invite. On this Mac, TestFlight can install compatible Mac builds.'
    : 'Scan an app’s QR code with your iPhone camera, or email yourself the invite and open it on your iPhone or iPad.';

function resetCards() {
  for (const card of cards) {
    const actions = card.querySelector('.beta-app-actions');
    for (const element of actions.querySelectorAll('a, img')) {
      element.removeAttribute(element.tagName === 'IMG' ? 'src' : 'href');
    }
    actions.querySelector('.beta-copy-fallback').value = '';
    actions.querySelector('.beta-copy-fallback').hidden = true;
    actions.querySelector('.beta-app-status').textContent = '';
    actions.querySelector('details').open = false;
    actions.querySelector('.beta-share').onclick = null;
    actions.querySelector('.beta-copy').onclick = null;
    actions.hidden = true;
    card.querySelector('.beta-platforms').textContent = '';
    card.querySelector('.beta-unavailable').hidden = true;
  }
}

function showInvites(invites) {
  resetCards();
  for (const card of cards) {
    const invite = invites.find((entry) => entry.id === card.dataset.betaApp);
    const unavailable = card.querySelector('.beta-unavailable');
    if (!invite || !allowedInvite.test(invite.url)) {
      unavailable.hidden = false;
      continue;
    }

    const appName = card.querySelector('h3').textContent;
    card.querySelector('.beta-platforms').textContent = invite.devices.map((device) => platformLabels[device]).join(' · ');
    const actions = card.querySelector('.beta-app-actions');
    const link = actions.querySelector('.beta-open');
    link.href = invite.url;
    link.textContent = ios || (mac && safari && invite.devices.includes('macos'))
      ? 'Open in TestFlight'
      : 'Open invite link';
    const subject = encodeURIComponent(`TestFlight invite for ${appName}`);
    actions.querySelector('.beta-email').href = `mailto:?subject=${subject}&body=${encodeURIComponent(invite.url)}`;
    if (/^data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+$/.test(invite.qr)) {
      actions.querySelector('img').src = invite.qr;
      actions.querySelector('details').hidden = false;
    } else {
      actions.querySelector('details').hidden = true;
    }
    const result = actions.querySelector('.beta-app-status');
    const share = actions.querySelector('.beta-share');
    share.hidden = typeof navigator.share !== 'function';
    share.onclick = async () => {
      try {
        await navigator.share({ title: `${appName} TestFlight invite`, url: invite.url });
      } catch (error) {
        if (error.name !== 'AbortError') result.textContent = 'Use Copy invite link or Email to myself.';
      }
    };
    actions.querySelector('.beta-copy').onclick = async () => {
      try {
        await navigator.clipboard.writeText(invite.url);
        result.textContent = 'Invite link copied.';
      } catch {
        const field = actions.querySelector('.beta-copy-fallback');
        field.value = invite.url;
        field.hidden = false;
        field.focus();
        field.select();
        result.textContent = 'Copy the selected invite link.';
      }
    };
    actions.hidden = false;
  }
  form.hidden = true;
  section.hidden = false;
  document.querySelector('#beta-invites-title').focus();
}

form.hidden = false;
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submit.disabled = true;
  status.textContent = 'Unlocking invites…';
  try {
    const response = await fetch(form.dataset.endpoint, {
      method: 'POST',
      headers: { 'X-Invite-Code': code.value },
      cache: 'no-store',
      redirect: 'error',
    });
    if (response.status === 401) {
      status.textContent = 'That passcode didn’t match. Try again.';
      code.select();
    } else if (response.status === 429) {
      status.textContent = 'Too many tries. Wait a minute and try again.';
    } else if (response.ok) {
      const { invites } = await response.json();
      code.value = '';
      showInvites(invites);
      status.textContent = '';
    } else {
      status.textContent = 'Invites are temporarily unavailable. Try again later.';
    }
  } catch {
    status.textContent = 'Couldn’t unlock invites. Check your connection and try again.';
  } finally {
    submit.disabled = false;
  }
});

document.querySelector('#beta-lock').addEventListener('click', () => {
  resetCards();
  section.hidden = true;
  form.hidden = false;
  code.focus();
});
