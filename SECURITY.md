# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅ Active  |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Email: Report privately via [GitHub Security Advisories](https://github.com/SAPTARSHI-coder/github-streak-designer/security/advisories/new).

I'll respond within **48 hours** and aim to release a fix within **7 days** of confirmation.

## Security Design

This project is a 100% static frontend UI (HTML/CSS/JS).

- **No Backend Code** — This repository contains no backend logic, no database connections, and stores no data.
- **No Secrets** — There are no API keys, environment variables, or sensitive tokens used in this repository.
- **No Server-Side Execution** — All rendering and interactions happen securely in the user's browser.
- **Data Fetching** — This UI does not fetch any private user data. The actual GitHub data fetching occurs securely on the private backend (`github-streak-tracker`).

If you find any XSS (Cross-Site Scripting) or other frontend vulnerabilities, please report them.
