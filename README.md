# Job AutoApplicant Extension 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/none.svg)](https://developer.chrome.com/docs/webstore)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourusername/job-autoapplicant/pulls)

A smart Chrome extension that automates job applications for freshers on LinkedIn and Indeed, using skill matching and intelligent form filling.

**⚠️ Important Note:** Use this tool responsibly and in compliance with website terms of service. Always verify automation permissions before use.

## Features ✨

- 🎯 Automatic detection of fresher/entry-level jobs
- 🧠 AI-powered skill matching algorithm
- ⚡ One-click application with saved profiles
- 💾 Smart job saving for non-matching positions
- 🔒 Secure local storage for user data
- 📊 Application tracking and analytics

## Installation 📦

### Prerequisites
- Node.js v18+
- Chrome/Edge browser
- GitHub account

### Local Setup
```bash
# Clone repository
git clone https://github.com/yourusername/job-autoapplicant.git

# Install dependencies
npm install

# Build extension
npm run build

# Load extension in Chrome:
1. Navigate to chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the /dist directory
Configuration ⚙️
Click extension icon in toolbar

Set up your skills in the popup interface

Upload your resume (PDF/DOCX)

Configure application preferences

Popup Interface

Usage 🖱️
Navigate to LinkedIn/Indeed job listings

Extension automatically detects suitable positions

Green badge indicates auto-apply availability

Red badge indicates job will be saved

Monitor notifications for application status

Tech Stack 💻
Core: JavaScript ES6+

Bundler: Webpack 5

Transpiler: Babel 7

Storage: Chrome Storage API

Security: Crypto-js encryption

Testing: Jest + Puppeteer

Project Structure 📂
Copy
.
├── background/          # Service worker logic
├── content_scripts/     # Platform-specific handlers
├── popup/               # User interface components
├── utils/               # Core utilities
├── tests/               # Automated tests
├── webpack.config.js    # Build configuration
└── manifest.json        # Extension metadata
Compliance & Ethics 🤝
This project is intended for educational purposes only. Users must:

Verify compliance with target websites' terms of service

Implement proper rate limiting

Obtain explicit user consent

Respect robots.txt directives

Use official APIs where available

Roadmap 🗺️
Enhanced skill matching using NLP

Multi-language support

Cross-platform compatibility (Firefox/Safari)

Advanced analytics dashboard

Official API integration

Troubleshooting 🛠️
Issue: Dependencies not installing
Fix: rm -rf node_modules && npm install

Issue: Content scripts not executing
Fix: Verify manifest.json matches patterns

Issue: Resume upload failing
Fix: Check file size (<5MB) and format (PDF/DOCX)

Contributing 🤝
We welcome contributions! Please follow these steps:

Fork the repository

Create feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open Pull Request

License 📄
This project is licensed under the MIT License - see the LICENSE file for details.
