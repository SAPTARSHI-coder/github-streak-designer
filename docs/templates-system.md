# The Template System

Both the UI Designer (this repo) and the Backend API use the **exact same** template rendering engine. This guarantees that what you see in the visual editor is *exactly* what GitHub will render on your profile.

---

## 🧩 The Universal Module Definition (UMD)

All templates in the `js/templates/` directory are written using a UMD pattern.

```javascript
(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node.js (Backend API)
    module.exports = factory();
  } else {
    // Browser (Designer UI)
    root.Templates = root.Templates || {};
    root.Templates.neon = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  
  return function renderNeon(data, options) {
     return `<svg>...</svg>`;
  }

}));
```

### Why do it this way?
1. **The Backend** runs in Node.js on Vercel. It uses `require('./neon')`.
2. **The Frontend Designer** runs in a standard web browser. It includes `<script src="js/templates/neon.js"></script>` which attaches the function to `window.Templates.neon`.

By writing the files this way, we do not need Webpack, Babel, or any complex build tools. The raw file works identically in both environments.

---

## 🎨 How Templates Render

A template is simply a pure Javascript function that takes two arguments:

1. `data`: The raw statistics (Username, Streaks, Total Contributions, Dates).
2. `options`: The visual configuration (Colors, Border Radius, Layout).

The function uses Template Literals (\` \`) to inject the variables into a massive SVG string and returns it.

Because SVGs are technically XML documents, you can use CSS `<style>` tags directly inside the SVG string to apply colors, fonts, and animations.

---

## 🛠️ Adding a New Template

If you design a new template (e.g. `bubble.js`):
1. Put the `bubble.js` file into the `src/templates/` folder on the **Backend Repo**.
2. Put the *exact same* `bubble.js` file into the `js/templates/` folder on the **Frontend Designer Repo**.
3. In the Backend, add it to `api/streak.js` (`VALID_TEMPLATES`).
4. In the Frontend, add a button for it in `customizer.html` so users can select it.
