<div align="center">

<br/>

```
██████╗ ███████╗ █████╗  ██████╗██╗  ██╗
██╔══██╗██╔════╝██╔══██╗██╔════╝██║  ██║
██████╔╝█████╗  ███████║██║     ███████║
██╔══██╗██╔══╝  ██╔══██║██║     ██╔══██║
██║  ██║███████╗██║  ██║╚██████╗██║  ██║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
```

### **Automate recruiter outreach intelligently.**

<br/>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white)
![Gmail](https://img.shields.io/badge/Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)

<br/>

> **Reach** scrapes recruiter emails from LinkedIn and fires off personalized emails with your resume attached — fully automated, one click, zero manual effort.

<br/>

</div>

---

## ⚡ What is Reach?

Most job seekers spend **hours** doing this manually:

```
Search LinkedIn → Find recruiter → Copy email → Open Gmail → Write email → Attach resume → Send → Repeat
```

**Reach collapses that entire pipeline into a single form submission.**

```
Fill form → Click Start → Watch it happen → Done.
```

You enter your Gmail, an App Password, a job keyword, and upload your resume.  
Reach handles everything else — browser automation, scraping, composing, and sending.

---



---

## 🏗️ How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                        REACH PIPELINE                       │
└─────────────────────────────────────────────────────────────┘

  [You]  →  Fill Form (Gmail + Password + Keyword + Resume)
              │
              ▼
  [React]  →  axios.post('/linkedin', FormData)
              │
              ▼
  [Express]  →  Multer saves resume  →  calls linkedinLogin()
              │
              ▼
  [Puppeteer]  →  Launches Chrome  →  Logs into LinkedIn
              │
              ▼
  [Puppeteer]  →  Searches keyword  →  Scrapes recruiter emails
              │
              ▼
  [Nodemailer]  →  Gmail SMTP  →  Email + Resume delivered 📨
              │
              ▼
  [React]  →  Status card updates  →  "Automation Complete ✓"
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| 🎨 Frontend | React + Plain CSS | Modern glassmorphism UI, zero dependencies |
| 🔌 HTTP | Axios | FormData POST with multipart support |
| 🖥️ Backend | Node.js + Express | Fast REST API, clean middleware chain |
| 📁 File Upload | Multer | Disk storage for resume files |
| 🤖 Automation | Puppeteer | Full Chromium control — real browser, not HTTP scraping |
| 📧 Email | Nodemailer | Gmail SMTP with attachment support |

---

## 📁 Project Structure

```
LINKEDIN_PROJECT/
│
├── Backend/                       # 🖥️  Node.js Backend
│   ├── node_modules/
│   ├── uploads/                   # Temp resume storage (Multer)
│   ├── .env
│   ├── debug_login.png            # Auto-saved on login failure
│   ├── debug_password.png         # Auto-saved on password failure
│   ├── linkedin.js                # Puppeteer automation engine
│   ├── mailer.js                  # Nodemailer email sender
│   ├── package-lock.json
│   ├── package.json
│   └── server.js                  # Express routes + Multer config
│
└── frontend/                      # ⚛️  React Frontend
    └── client/
        ├── node_modules/
        ├── public/
        ├── src/                   # App.jsx, App.css, index.css
        ├── .gitignore
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── README.md
        └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- Gmail account with **2-Step Verification** enabled
- A **Google App Password** ([How to get one ↓](#-google-app-password-setup))

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/linkedin-project.git
cd LINKEDIN_PROJECT

# 2. Install backend dependencies
cd Backend
npm install

# 3. Install frontend dependencies
cd ../frontend/client
npm install
```

### Run

```bash
# Terminal 1 — Backend
cd Backend
node server.js
# ✓ Server running at http://localhost:3000

# Terminal 2 — Frontend
cd frontend/client
npm run dev
# ✓ Open http://localhost:5173
```



## 🔑 Google App Password Setup

> Regular Gmail passwords won't work. You need an **App Password** — a 16-character token Google generates specifically for apps.

```
Step 1  →  Go to myaccount.google.com
Step 2  →  Security → 2-Step Verification (enable it)
Step 3  →  Search "App Passwords" in the search bar
Step 4  →  Select app: Mail  |  Select device: Windows Computer
Step 5  →  Click Generate
Step 6  →  Copy the 16-character password  →  Paste into Reach
```

✅ Your main Gmail password is **never** used or stored.

---

## 🧠 Engineering Challenges

Building this wasn't straightforward. Here are the real problems solved:

<details>
<summary><b>🤖 LinkedIn Bot Detection</b></summary>

<br/>

LinkedIn checks `navigator.webdriver` in JavaScript to detect Puppeteer.

```js
// Run before any page loads — hides the Puppeteer fingerprint
await page.evaluateOnNewDocument(() => {
  Object.defineProperty(navigator, "webdriver", { get: () => undefined });
});

// Also spoof the User-Agent
await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)...");
```

</details>

<details>
<summary><b>🎯 Selector Stability — LinkedIn uses random class names</b></summary>

<br/>

LinkedIn generates random IDs and class names on every page load:

```html
<!-- These change every session — useless as selectors -->
<input id=":r3:" class="efb8f1b0 _122158cd _7d9cda5f ...">
```

The fix: target **semantic HTML attributes** that LinkedIn cannot randomize:

```js
// Stable — tied to HTML/accessibility spec
"input[autocomplete='username webauthn']"   // email
"input[autocomplete='current-password']"    // password
```

</details>

<details>
<summary><b>⌨️ The Tab Key Solution (hardest bug)</b></summary>

<br/>

The password field was consistently not found by Puppeteer — even though it was visible in the DOM. LinkedIn's React re-renders the form after email input loses focus, and the password field's event listeners aren't attached yet.

Tried and failed:
- `waitForSelector` with multiple selectors
- `scrollIntoView` + `focus` + 2000ms delay  
- Targeting `autocomplete='current-password'` directly

**The fix that worked:**

```js
await emailField.type(LINKEDIN_EMAIL, { delay: 80 });

// Press Tab — exactly like a real user would
// LinkedIn's own JS moves focus to the password field
await page.keyboard.press("Tab");
await new Promise((r) => setTimeout(r, 1000));

// Type directly into the now-focused field — no selector needed
await page.keyboard.type(LINKEDIN_PASSWORD, { delay: 80 });
```

> Mimicking real user behavior was the solution. No selector. Just `Tab`.

</details>

<details>
<summary><b>🔄 Browser Lifecycle — Chromium staying open after crashes</b></summary>

<br/>

Early version had `browser.close()` after a `return` statement — unreachable code. Puppeteer processes were piling up.

```js
// ❌ browser.close() never runs
return { success: true };
await browser.close(); // dead code

// ✅ finally block ALWAYS runs — success or failure
try {
  // automation...
  return { success: true };
} catch (err) {
  return { success: false };
} finally {
  await browser.close(); // guaranteed cleanup
}
```

</details>

<details>
<summary><b>⚛️ React Crash — "Objects are not valid as a React child"</b></summary>

<br/>

Axios automatically parses JSON responses. `res.data` was already the object `{ success, message }` — not a string. Setting that as `status.message` made React try to render an object as a DOM text node.

```js
// ❌ res.data is { success: true, message: "..." } — React can't render objects
setStatus({ type: "success", message: res.data });

// ✅ Extract just the string
setStatus({ type: "success", message: res.data.message });
```

</details>

---

## 🔒 Security

- ✅ **Zero credential storage** — Gmail and App Password exist only in memory during the request
- ✅ **App Password scoped** — not your main Gmail password, revocable anytime
- ✅ **No database** — nothing is persisted beyond the uploaded resume file
- ✅ **In-memory processing** — all sensitive data is garbage collected after the async function resolves

---

## 🗺️ Roadmap

- [ ] Multi-page scraping — scroll through multiple result pages
- [ ] Email personalization — use recruiter name + company in body
- [ ] Rate limiting — configurable delay between sends
- [ ] Resume parsing — auto-extract name & skills for smarter outreach  
- [ ] Sent emails dashboard — track history, status, replies
- [ ] Docker support — one-command deployment

---

## 📄 License

MIT © Aryan

---

<div align="center">

**Built with obsession using React, Node.js, Puppeteer & Nodemailer**

<br/>

*If this helped you land interviews, drop a ⭐*

</div>
