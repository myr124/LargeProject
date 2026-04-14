# MERN Deployment Notes

This project already differs from the handout:

- The backend lives in `backend/`
- The frontend lives in `frontend/`
- The API runs on port `5001` by default

## 1. Local environment

Create a root `.env` file from [.env.example](/Users/ericgeorge/workspace/code/cards/.env.example).

Required values:

- `MONGO_URI`
- `ACCESS_TOKEN_SECRET`
- `RESEND_API_KEY`

Optional values:

- `PORT` defaults to `5001`
- `EMAIL_FROM` defaults to `Breadboxd <onboarding@resend.dev>`
- `PUBLIC_API_BASE_URL` defaults to `http://localhost:5001/api`

For frontend local development, you can also create `frontend/.env` from [frontend/.env.example](/Users/ericgeorge/workspace/code/cards/frontend/.env.example), but it is optional because the app falls back to `http://localhost:5001/api`.

## 2. Frontend API behavior

The frontend now resolves its API base URL in this order:

1. `VITE_API_BASE_URL`
2. In production: `http://<current-hostname>:5001/api`
3. In development: `http://localhost:5001/api`

This is the repo-specific equivalent of the handout's `buildPath()` function.

## 3. Build locally

Frontend:

```bash
cd frontend
npm ci
npm run build
```

Backend:

```bash
cd backend
npm ci
npm start
```

Use `npm run dev` in `backend/` if you want `nodemon`.

## 4. One-time server setup

These steps are adapted from the handout for this repository layout.

Install software:

```bash
sudo apt-get update
sudo apt-get install -y nginx nodejs npm
sudo npm install -g n
sudo n stable
sudo npm install -g pm2
```

Create deployment directories:

```bash
sudo mkdir -p /var/www/html
sudo mkdir -p /var/cards/backend
```

Place your backend `.env` at:

```bash
/var/cards/.env
```

That location matches the backend code, which explicitly loads the env file from the project root above `backend/`.

Recommended `.env` values on the server:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Breadboxd <onboarding@resend.dev>
PUBLIC_API_BASE_URL=http://your-domain.com:5001/api
```

## 5. Nginx

Example server block:

```nginx
server {
    listen 80;
    listen [::]:80;

    root /var/www/html;
    index index.html;

    server_name your-domain.com www.your-domain.com;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Then validate and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Firewall

Open the backend port:

```bash
sudo ufw allow 5001/tcp
```

## 7. GitHub Actions deployment

The workflow file is [.github/workflows/deploy.yml](/Users/ericgeorge/workspace/code/cards/.github/workflows/deploy.yml).

Add these repository secrets:

- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_PASSWORD`
- `SERVER_PORT`

The workflow will:

- build the frontend
- copy `frontend/dist` to `/var/www/html`
- copy `backend/` to `/var/cards/backend`
- write `/var/cards/.env` from GitHub Secrets
- run `npm ci --omit=dev`
- restart PM2 as `breadboxd-api`

## 8. Important difference from the handout

Do not copy only `server.js` and root `package.json` like the handout suggests. This repo's backend depends on the full `backend/` directory, including routes, controllers, models, and utilities.
