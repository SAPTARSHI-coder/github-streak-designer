# Contributing to GitHub Streak Designer

Thank you for your interest in contributing! This project is open to improvements.

---

## 🏗️ Project Architecture

This repository contains ONLY the frontend UI for designing streak cards. 
- It consists entirely of static HTML, CSS, and vanilla JS.
- It relies on a separate backend repository (`github-streak-tracker`) to fetch the real data and render the final SVGs for GitHub Profiles.

---

## 💻 Setting Up Locally

There are no build steps, Node modules, or package managers required.

```bash
git clone https://github.com/SAPTARSHI-coder/github-streak-designer.git
cd github-streak-designer

# Open customizer.html directly in your web browser:
start customizer.html # (Windows)
open customizer.html  # (Mac)
```

---

## 🛠️ Making Changes

If you want to add a new template or palette, you must add it to **both** repositories:
1. Add the design logic to the **Backend** (`github-streak-tracker`).
2. Add the corresponding visual preview options here in the **Designer UI** (`js/templates/`, `js/palettes.js`).

---

## ⚖️ Attribution

If you fork this project and deploy it publicly, you **must** include a visible credit per the [LICENSE](LICENSE):

> *Based on [GitHub Streak Designer](https://github.com/SAPTARSHI-coder/github-streak-designer) by [SAPTARSHI SADHU](https://github.com/SAPTARSHI-coder)*

PRs that remove attribution from the codebase or documentation will not be accepted.
