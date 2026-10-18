# BattamizDill visitor counter

This adds a dynamic profile visitor counter using **Netlify Functions + Netlify Blobs**. No VPS and no external database are required.

## 1. Install the Netlify Blobs package

From your existing React/Vite project:

```bash
npm install @netlify/blobs
```

`react-icons` is already used by the portfolio. If it is not installed in your current project:

```bash
npm install react-icons
```

## 2. Copy the files

Copy:

```text
netlify/functions/visitor-count.mjs
src/components/VisitorCounter.jsx
```

into the matching folders of your portfolio.

## 3. Add the counter to the website

For example, in `src/components/Footer.jsx`:

```jsx
import VisitorCounter from "./VisitorCounter";
```

Then place this wherever you want the counter to appear, for example above the copyright row:

```jsx
<div style={{ marginTop: 24 }}>
  <VisitorCounter />
</div>
```

You can also put it in `Home.jsx` if you want it on the homepage.

## 4. Add the CSS

Copy the contents of `src/visitor-counter.css` into your existing `src/index.css`.

Do NOT import it separately if you paste the rules into `index.css`.

## 5. Deploy to Netlify

Push the files to the same Git repository connected to Netlify and deploy normally.

`netlify.toml` in your root directory automatically configures:
- Build command: `npm run build`
- Functions directory: `netlify/functions` with `esbuild`
- SPA redirects: `/* -> /index.html`

Netlify Functions are exposed under:

```text
/.netlify/functions/visitor-count
```

Netlify automatically supplies the site-wide context required by Netlify Blobs when the function runs on Netlify.

## How counting works & zero-reset persistence

- **Deploy Persistence**: The store is strictly site-scoped (`battamizdill-analytics-v2`) and persistent. Updating code, redeploying, or rebuilding on Netlify will NEVER reset or clear this store.
- **Monotonic Protection**: The client and server enforce monotonic counting (`Math.max(previous, newCount)`), meaning the count is mathematically guaranteed never to regress or drop backwards.
- **Instant Display**: The counter loads immediately from localStorage on repeat visits so there is zero flash of blank or zero.
- **Session deduplication**: A browser session only triggers one increment, while subsequent visits read the latest live count.
- **Privacy Friendly**: No IP address, name, email, or personal information is stored.

## Important

The visitor count is stored in Netlify Blobs under the store name `battamizdill-analytics-v2` and key `profile-visitors-total`.
No VPS, external database, or API keys are required.
