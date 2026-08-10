# Deploying Reclaim frontend to Render

The repo includes a [`render.yaml`](./render.yaml) blueprint, so Render can set the
service up automatically.

## One-time setup

1. Push this repo to GitHub (see below).
2. In the [Render dashboard](https://dashboard.render.com): **New +** → **Blueprint**.
3. Connect your GitHub account and pick the `Reclaim-Frontend` repo.
4. Render reads `render.yaml` and proposes a **web service** named `reclaim-frontend`.
   Click **Apply**.
5. First build runs `npm ci && npm run build`, then serves with `npm run start`.

## Environment variables (set in the Render dashboard)

| Key | Value | Notes |
|-----|-------|-------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | your `pk.…` token | **Build-time.** After setting it, click **Manual Deploy → Clear build cache & deploy** so it gets baked into the client bundle. Until then the app uses the built-in styled map. |
| `NODE_VERSION` | `22.21.0` | already in `render.yaml` |

> The Mapbox token is a *publishable* client key — safe to expose in the browser bundle.
> The **Anthropic API key** does **not** go here — it belongs to the backend service
> (`Reclaim-Backend`) we deploy in P6, so it's never exposed to the browser.

## Notes

- Free-tier web services spin down after inactivity and cold-start on the next request
  (~30s). Fine for a demo/marking.
- `NEXT_PUBLIC_*` vars are inlined at build time, so changing the token requires a redeploy.
