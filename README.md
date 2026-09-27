# Communication Styles

A small self-assessment app with five research-based questionnaires:

- **Conflict Style** (25 questions): Thomas-Kilmann / Rahim ROCI-II
- **Listening Style** (20 questions): Watson, Barker & Weaver LSP
- **Feedback Style** (20 questions): Stone & Heen, Linderbaum & Levy
- **Communication Style** (20 questions): Merrill & Reid Social Styles
- **Emotional Intelligence** (20 questions): Mayer-Salovey-Caruso / Goleman

Results are saved in the browser's `localStorage`, so they stay on the device and are never sent anywhere.

## Project layout

| File | Purpose |
| --- | --- |
| `index.html` | The whole app: markup, styles, assessment data and logic |
| `sw.js` | Service worker for offline use as a PWA |
| `manifest.json`, `icons/` | PWA manifest and icons |
| `electron-main.js` | Electron main process for the Windows desktop app |
| `preload.js` | The only bridge between the page and Electron (opens links externally) |

## Running

**Web / PWA:** serve the folder over HTTP, for example:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. The service worker only runs over `http(s)`.

**Desktop (Electron):**

```sh
npm install
npm start
```

## Building the Windows installer

```sh
npm run build
```

The NSIS installer is written to `dist/`.

## Releasing a web update

The service worker uses a network-first strategy. When you change cached files, bump `CACHE_NAME` in `sw.js` so old caches are cleared.
