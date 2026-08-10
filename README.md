# Reclaim Frontend — Campus Lost & Found

Next.js web app for the Reclaim campus lost & found system.

**CPEN 208 Project 3 — University of Ghana**

## Tech Stack
- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS** + custom design system
- **Mapbox GL JS** via react-map-gl
- **JWT auth** with React Context

## Running Locally

### Prerequisites
- Node.js 22+

### Environment Variables
| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL, e.g. `http://localhost:8080` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | No | Mapbox access token for map views |

### Start
```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Pages
- `/` — Browse board (grid + map view, search, filters)
- `/login` — Sign in / Register
- `/report` — Report lost/found item (with AI Smart-Describe)
- `/items/[id]` — Item detail with photos, mini-map, claim button
- `/items/[id]/matches` — Smart match suggestions with AI explainer
- `/dashboard` — User dashboard (my reports, stats, quick actions)
- `/my-reports` — Full list of user's reports
- `/messages` — In-app messaging
- `/notifications` — Notification center
- `/profile` — Profile settings, logout
- `/admin` — Admin dashboard (stats, moderation)
- `/admin/heatmap` — Loss/found hotspot map

## Features
- **AI Smart-Describe**: Upload a photo, AI fills in title/description/category/tags
- **Smart Match Explainer**: AI explains why two items might be the same
- **Map views**: Interactive Mapbox maps with item pins, location picker, heatmap
- **Real-time matching**: Automatic match suggestions with weighted scoring
- **In-app messaging**: Private conversations between finders and claimants
