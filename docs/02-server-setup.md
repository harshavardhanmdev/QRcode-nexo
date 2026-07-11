# 02 · One-time office-server setup

Target: `slplserver@100.109.145.97` (reachable over Tailscale — the Tailscale
app must be running on your PC).

## Step 1 — install the deploy key (you type the password once)

A deploy keypair lives at `%USERPROFILE%\.ssh\qrdock_deploy`. Install its
public half on the server (one password prompt, then never again):

```powershell
type $env:USERPROFILE\.ssh\qrdock_deploy.pub | ssh slplserver@100.109.145.97 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```

Test it:

```powershell
ssh -i $env:USERPROFILE\.ssh\qrdock_deploy slplserver@100.109.145.97 "echo key works"
```

> **Security note:** the server password was shared in chat during this build.
> After the key works, change it (`passwd` on the server). Optionally disable
> password SSH entirely (`PasswordAuthentication no` in /etc/ssh/sshd_config)
> — but only after confirming key login works and other users of the box agree.

## Step 2 — Node 24 + pm2 (skip anything already present)

```bash
# on the server
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 24
npm install -g pm2
pm2 startup   # run the command it prints once, so apps survive reboots
```

## Step 3 — clone and configure

```bash
mkdir -p ~/apps && cd ~/apps
git clone https://github.com/harshavardhanmdev/QRcode-nexo.git qrcode-nexo
cd qrcode-nexo
cp deploy/env/production.env.example .env.production
bash deploy/port-audit.sh          # shows free ports in 4600–4699
nano .env.production               # set WEB_PORT, API_PORT + generate secrets:
                                   #   openssl rand -base64 32   (run twice)
```

## Step 4 — first deploy

```bash
bash deploy/deploy.sh
```

It installs, builds, migrates, starts `qrdock-web` + `qrdock-api` under pm2,
and health-checks both. Note the **WEB_PORT** it prints — that's what
Cloudflare points at (docs/04).

## Step 5 — reboot persistence + nightly backups

This server has no cron; systemd user units do the job without sudo:

```bash
cd ~/apps/qrcode-nexo && bash deploy/install-timers.sh
```

That schedules the 03:10 nightly DB backup and registers pm2 resurrection.
**One sudo command** (one-time) makes them survive reboots:

```bash
sudo loginctl enable-linger slplserver
```
