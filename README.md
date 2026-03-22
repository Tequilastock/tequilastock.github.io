# customsoftware

Live site → <https://tequilastock.github.io/>

## Project tree


.
├── assets/js/ # flappy.js, snake.js, tetris.js
├── games/ # standalone game pages
├── index.html # main marketing site
├── thank-you.html # post-form landing
├── sitemap.xml • robots.txt • manifest.webmanifest
└── README.md


## Local dev

```bash
npm install      # 1×
npm run lint     # ESLint (assets/js)
npm run format   # Prettier auto-format
npx serve .      # live preview on http://localhost:3000
Deploy

Push to main → GitHub Pages auto-builds.

Contributing
branch feat/<topic> or fix/<bug>
run npm run lint && npm run format
open a PR (CI runs lint)
License

MIT © 2026 customsoftware
