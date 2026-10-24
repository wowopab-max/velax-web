# VELAX — Media Toolkit

Full Node.js/Express project with the VELAX frontend and Scrapr core library.

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm start
```

Then open http://localhost:3000.

## Deploy to Render

- Create a GitHub repository and upload the **contents** of this project folder (not a ZIP file).
- Create a Render Web Service connected to the repository.
- Build command: `npm install`
- Start command: `npm start`
- Runtime: Node.

The server reads `process.env.PORT` and binds to `0.0.0.0` for hosting. Keep API keys and secrets out of the repository. Some scraping providers may not work if they depend on external browser binaries or source-site changes.
