# GitHub Streak Designer (UI Frontend)

<div align="center">

**A beautiful, interactive visual editor to customize and generate dynamic GitHub Streak cards for your profile.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5 & CSS3](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-f06529.svg)](https://developer.mozilla.org/)

![Designer Preview](https://raw.githubusercontent.com/SAPTARSHI-coder/github-streak-designer/main/docs/ui-preview.png)

</div>

---

## 🏗️ The Architecture: Two-Part System

This project works in tandem with a private backend API. We split the architecture into two pieces for maximum security and ease of use:

1. **The Backend API (`github-streak-tracker`)**: A serverless Vercel function that securely holds your GitHub Token, fetches your raw contribution data from GitHub's GraphQL API, and renders the SVG. 
2. **The Designer UI (This Repository)**: A purely frontend, static HTML/CSS/JS website. It provides a visual editor where you can pick templates, tweak colors, and copy the final generated URL.

When you copy the Markdown code from this Designer UI, it points to your secure backend to generate the live, real-time image.

---

## 🚀 How to Deploy

Because this repository is 100% static (HTML, CSS, JS), you can deploy it anywhere in seconds. 

### Option A: Deploy to Vercel (Recommended)
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New → Project**.
3. Import your `github-streak-designer` repository.
4. Click **Deploy**. Vercel will automatically detect that it's a static site. No build commands necessary.

### Option B: Deploy to GitHub Pages (Free)
1. Go to this repository's **Settings** on GitHub.
2. Click on **Pages** in the left sidebar.
3. Under **Source**, select `Deploy from a branch`.
4. Choose the `main` branch and click **Save**.
5. Your designer will be live at `https://your-username.github.io/github-streak-designer/` in a few minutes!

---

## ⚙️ How it Works

1. Open the live URL of your deployed Designer UI.
2. Use the live preview to customize:
   - **Templates**: Ember, Frost, Neon.
   - **Palettes**: Dark, Dracula, Catppuccin, Nord, Light, or fully Custom.
   - **Layouts**: Row, Stacked, Hero.
   - **Fonts**: Inter, JetBrains Mono, Space Grotesk, Monospace.
3. Once you love how the preview looks, click **Copy README link**.
4. Paste the copied `![GitHub Streak](...)` markdown directly into your GitHub Profile's `README.md`.

---

## 💻 Local Development

No build steps, no Node modules, no Webpack. Just open the `index.html` file in your browser.

```bash
git clone https://github.com/SAPTARSHI-coder/github-streak-designer.git
cd github-streak-designer

# Open customizer.html directly in your web browser:
start customizer.html # (Windows)
open customizer.html  # (Mac)
```

---

## 🔗 Customizing the Backend Link

If you ever deploy a new backend, simply edit `js/customizer.js` to point to the new URL:

```javascript
// js/customizer.js - Line 14
var API_BASE = 'https://your-new-backend-url.vercel.app';
```

<div align="center">
Made with ♥ by <b>SAPTARSHI SADHU</b>
</div>
