# Friends & Family TestFlight portal

The Hugo page lives at `/friends-and-family/`. This Worker owns only the POST to `/friends-and-family/unlock`. Build and test with `npm ci && npm test` in this directory. Deploy with `wrangler deploy`.

Keep the shared passcode in a password manager. Configure its uppercase, trimmed SHA-256 digest as the `PASSCODE_SHA256` Worker secret. Set `INVITES_JSON` as a Worker secret containing the dedicated external group links and supported devices:

```json
{"provenance":{"url":"https://testflight.apple.com/join/EXAMPLE0","devices":["ios","tvos"]}}
```

The app keys are `provenance`, `ifly`, `icube`, and `rasterlab`. The device values are `ios`, `tvos`, and `macos`. An omitted app displays as unavailable. Apple controls actual device eligibility and tester limits. Keep a current, approved build in each Friends and Family external group. To rotate a shared link, replace it in App Store Connect and update the Worker secret. Anyone who receives an unlocked Apple invitation can forward it independently of the portal.
