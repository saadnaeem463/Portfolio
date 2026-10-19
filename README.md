# Saad Naeem · Portfolio (Next.js)

Next.js 14 (App Router) · Tailwind CSS · GSAP. Same design language as the Angular version.

## Run
```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Edit your content
- `data/site.js`: bio, links, projects, tech stack, education.
- `public/assets/images/`: your photo (`profile.webp`), logo and project screenshots.
- Contact form uses FormSubmit: confirm the one-time activation email sent to your Gmail after the first submission.
- The contribution graph reads public data for the GitHub user set in `data/site.js`.

## Deploy
Push to GitHub and import it on https://vercel.com (zero config).
