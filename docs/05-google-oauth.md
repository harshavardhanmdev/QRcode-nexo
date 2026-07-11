# 05 · Enabling "Continue with Google"

The button appears automatically once credentials exist — nothing to deploy.

1. Go to https://console.cloud.google.com/ → create (or pick) a project,
   e.g. "qrdock".
2. **APIs & Services → OAuth consent screen**: External → app name `qrdock`,
   support email `saradapublications18@gmail.com`, developer contact same.
   Scopes: only the default (openid/email). Publish the app.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: *Web application*, name `qrdock-web`
   - Authorized redirect URIs — add BOTH:
     - `https://qr.theslpl.in/api/auth/google/callback`
     - `http://localhost:3000/api/auth/google/callback` (local testing)
4. Copy the **Client ID** and **Client secret** into
   `~/apps/qrcode-nexo/.env.production` on the server:

   ```
   GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=xxxxxxxx
   ```

5. `pm2 restart qrdock-api --update-env` (or just re-run `deploy.sh`).
6. Open https://qr.theslpl.in/login — the Google button is now visible.
   Sign in with any Google account to confirm.

Notes
- Users who registered with email/password and later use Google with the same
  address are linked automatically (verified emails only).
- No secret ever goes in the web app or the repo — server env only.
