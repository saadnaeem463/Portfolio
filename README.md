<div align="center">

# Saad Naeem · Portfolio

**Full-Stack Developer & ML Enthusiast**

A fast, responsive personal portfolio showcasing my projects, tech stack and GitHub activity.

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Saad_Naeem-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/saad-naeem-5138a3409)
[![Gmail](https://img.shields.io/badge/Gmail-Contact-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:saadnaeem463@gmail.com)

<!-- After deploying, add your live link here:
[**View Live Site →**](https://your-portfolio-url.vercel.app)
-->

</div>

---

## ✨ Features

- **Cinematic dark theme**: near-black background, warm off-white text, red accent, Anton / Manrope / Caveat type
- **Hero**: oversized name, background-removed portrait (`public/assets/images/profile-cutout.webp`) on a red disc, spinning badge, pointer spotlight
- **Swarm build on load + auto-tour**: the page starts blank and a swarm of 16 labelled cursor agents (React, Next.js, Node, ...) fly to each block, drag a selection box over it and build it live. Every button, icon, tag, tech tile and form field is its own block (`data-build`), so the agents build the small pieces one by one, while the page scrolls itself down. It waits whenever something on screen is still unbuilt, then glides back to the top when everything is done. Touching, scrolling or pressing a navigation key hands control to the visitor, and the agents then build whatever they scroll to
- **When the build finishes** the agents circle in the bottom-left corner, nothing is ever rebuilt, and a **Go live** button pops up in the navbar. **Replay build** runs it again; **Skip** finishes instantly. Visitors with reduced-motion enabled get the finished site immediately
- Scroll progress bar, active-section nav underline, tech-stack marquee
- **Filterable project grid** with a detail dialog (Esc / backdrop / close button, focus returns to the clicked card)
- **GitHub contribution graph** pulled live for the last year
- **Working contact form** (via FormSubmit)

## 🚀 Projects Featured

| Project | Stack |
|---|---|
| **Market Hall**: MERN e-commerce marketplace | React, Node.js, Express, MongoDB, Socket.io |
| **CivicTrack**: report, map & resolve civic issues in real time | Next.js, MongoDB, Pusher, shadcn/ui |
| **Urdu OCR Studio**: reads printed Urdu from images | Python, CRNN, CTC, Streamlit |
| **Heart Attack Predictor**: ML risk-prediction app | Python, scikit-learn, Pandas, Streamlit |
| **Expense Tracker**: income, expenses & category breakdown | React, TypeScript |

## 🛠️ Built With

- [Next.js 14](https://nextjs.org/) (App Router) and [React 18](https://react.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Fonts](https://fonts.google.com/) (Anton, Manrope, Caveat)
- [Skill Icons](https://skillicons.dev/) for tech-stack icons
- [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api) for the contribution graph
- [FormSubmit](https://formsubmit.co/) for the contact form

## 📁 Project Structure

```
├── app/
│   ├── layout.js        # fonts + SEO metadata
│   ├── page.js          # all page sections
│   └── globals.css      # design tokens and shared styles
├── components/
│   ├── Header.js        # sticky header, progress bar, Motion button
│   ├── Hero.js          # big name + portrait
│   ├── Swarm.js         # agents that build the page (canvas engine)
│   ├── Reveal.js        # marks a block as a build target (data-build)
│   ├── Projects.js      # filter + grid, ProjectDialog.js = detail modal
│   ├── About.js         # bio, education, tech stack
│   ├── Contributions.js # GitHub contribution graph
│   └── Contact.js       # contact form
├── data/
│   ├── site.js          # ✏️ your content: bio, projects, stack, education
│   └── icons.js         # social icon paths
└── public/assets/       # photo, logo, project screenshots, icons
```

## ⚙️ Getting Started

**Prerequisites:** Node.js 18.17 or newer.

```bash
# 1. Clone the repo
git clone https://github.com/saadnaeem463/<your-repo-name>.git
cd <your-repo-name>

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |

## ✏️ Customizing

- **Content:** edit `data/site.js` (bio, links, projects, tech stack, education).
- **Photo and screenshots:** replace the files in `public/assets/images/`.
- **Colors and fonts:** `tailwind.config.js`, `app/globals.css` and the font link in `app/layout.js`.
- **Contact form:** the first submission triggers an activation email from FormSubmit to the address in `data/site.js`. Confirm it once and messages will start arriving.

## 🌐 Deployment

The easiest way is [Vercel](https://vercel.com/): push this repo to GitHub, click **Add New → Project**, import it and deploy. No extra configuration is needed.

## 📬 Contact

**Saad Naeem**
[LinkedIn](https://www.linkedin.com/in/saad-naeem-5138a3409) · [GitHub](https://github.com/saadnaeem463) · saadnaeem463@gmail.com

---

<div align="center">Built with Next.js, Tailwind CSS and Framer Motion.</div>
