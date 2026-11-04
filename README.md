# Communication Styles

Five short self-assessments: Conflict Style, Listening Style, Feedback Style, Communication
Style and Emotional Intelligence. Answer 20–25 statements on a 1–5 scale and get your primary
and secondary styles, scores, and a link to read more.

The whole app is one file, `index.html`, and it runs in two places:

- **Web / installable app (PWA):** <https://enachealex.github.io/CommunicationApp/>, served by
  GitHub Pages straight from the `main` branch. `sw.js` makes it work offline.
- **Windows desktop app:** the same `index.html` in an Electron window (`electron-main.js`).

Results are saved in the browser's `localStorage` on the device (one list per assessment,
e.g. `conflict_scores_history`). Nothing is sent anywhere.

## Running it

- Web: serve the folder over http (a service worker needs http or https, not `file://`), e.g.
  `npx http-server .`, then open the printed address.
- Desktop: `npm install`, then `npm start`.

## Building the Windows app

| Command | Output |
|---|---|
| `npm run build` | an installer, `dist/Communication Styles Setup <version>.exe` (electron-builder) |
| `npm run package` | a portable folder, `dist/Communication Styles-win32-x64/` (@electron/packager) |

## Releasing

- **Web:** pushing to `main` publishes it. Bump `CACHE_NAME` in `sw.js` when you change a cached
  file, so installed copies drop the old cache.
- **Desktop:** build as above and share the output. Users don't get updates automatically.

## Desktop security

The page runs with no Node.js access (`contextIsolation`, sandbox, no `nodeIntegration`). Its one
desktop capability, opening a "Learn about …" link in the browser, is exposed by `preload.js`.
The main process only opens Google search links (`external-links.js`) and blocks navigation
and new windows.
