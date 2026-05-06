# Deployment Guide

The `github-streak-designer` repository is a 100% static frontend. It contains only HTML, CSS, and vanilla JS. 

Because it does not require a Node.js server, a database, or any build steps (like Webpack or Vite), it is incredibly easy and free to host.

---

## Option 1: Vercel (Recommended)

Since the Backend API is already hosted on Vercel, this is the most seamless option.

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard).
2. Click **Add New → Project**.
3. Connect your GitHub account and import the `github-streak-designer` repository.
4. Click **Deploy**.

Vercel will immediately recognize that it's a static site. No build commands or output directories need to be configured. 

---

## Option 2: GitHub Pages (Free & Easy)

GitHub provides free hosting for static repositories directly from the repository settings.

1. Go to your `github-streak-designer` repository on GitHub.
2. Click on the **Settings** tab.
3. In the left sidebar, scroll down and click **Pages**.
4. Under "Build and deployment", set the **Source** to `Deploy from a branch`.
5. Select the `main` branch from the dropdown menu and click **Save**.
6. Wait 1-2 minutes. GitHub will display a banner at the top of the page saying: `Your site is live at https://your-username.github.io/github-streak-designer/`.

---

## Option 3: Netlify / Cloudflare Pages

The process is identical to Vercel:
1. Log into Netlify or Cloudflare Pages.
2. Import the GitHub repository.
3. Deploy (Leave build settings blank).

---

## 🔒 Keeping the Backend Safe

By deploying this Designer UI publicly, you are giving people a tool to customize their SVG. 
When they click "Copy Link", the link will point to your private backend API (e.g. `https://github-streak-tracker-for-all.vercel.app`). 

This is completely safe. The frontend UI does not contain your GitHub Token, and your Vercel backend securely handles the API limits.
