# Designer Architecture Overview

This document explains how the visual editor works internally. 

There is **no backend logic** in this repository. All real-time previews happen entirely in the browser using JavaScript.

---

## 🏗️ How the Preview Works

When you drag a slider or click a color palette in the Designer UI, the app does **not** call the Vercel API. 

Calling the backend on every slider move would instantly hit the GitHub API rate limit (5,000 requests/hour). Instead, the preview uses "fake" placeholder data to show you what the design looks like immediately.

**The Workflow:**
1. You change a setting (e.g. `Border Radius = 15px`).
2. `customizer.js` intercepts the event and updates its internal `state` object.
3. It calls `render()`, passing the `state` options and **fake stats** (Total: 1247, Current: 42, Longest: 87).
4. The template function (e.g., `js/templates/neon.js`) returns an SVG string.
5. The `preview-wrap` HTML div is updated with this new SVG string.

---

## 🔗 The Real API Connection

The only time the Designer interacts with the Backend is when you click **"Copy README link"**. 

At this point, the Designer builds a URL string combining all your current settings:

```javascript
// Example generated URL
https://github-streak-tracker-for-all.vercel.app/streak?username=SAPTARSHI-coder&template=neon&palette=dracula&layout=hero
```

When you paste this Markdown into your GitHub Profile, GitHub acts as the client. GitHub fetches the image from that URL, the Vercel backend processes the query parameters, fetches your real live GitHub data, and renders the exact SVG you designed.

---

## 📂 Repository Structure

| Directory/File | Purpose |
|----------------|---------|
| `/index.html` | The landing page listing available templates. |
| `/customizer.html` | The main visual editor interface. |
| `/js/customizer.js` | The core engine (State management, event listeners, rendering). |
| `/js/palettes.js` | Contains all color HEX codes for Dark, Dracula, Nord, etc. |
| `/js/icons.js` | Contains raw SVG paths (flame, bolt, chart) so we don't rely on emojis. |
| `/js/templates/` | The visual templates (Ember, Frost, Neon) used to generate the in-browser preview. |

**Important Note:** The files in `js/templates/`, `js/icons.js`, and `js/palettes.js` are **identical** to the ones in the backend API. If you add a new template or color to the backend, you must copy the file over to this UI repository so users can preview it!
