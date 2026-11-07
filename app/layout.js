import "./globals.css";

const url = "https://saadnaeem.vercel.app"; // ✏️ change to your real domain after deploying
export const metadata = {
  metadataBase: new URL(url),
  title: "Saad Naeem | Full-Stack & ML Developer",
  description: "Saad Naeem is a full-stack developer and machine-learning enthusiast building web apps with React, Next.js, Node.js, MongoDB and Python.",
  authors: [{ name: "Saad Naeem" }],
  keywords: ["Saad Naeem", "full stack developer", "MERN", "React", "Next.js", "Python", "machine learning", "Urdu OCR"],
  alternates: { canonical: url },
  openGraph: { title: "Saad Naeem | Full-Stack & ML Developer", description: "Full-stack + ML. Built to be used, not just to run.", url, type: "website" },
  twitter: { card: "summary_large_image", title: "Saad Naeem | Full-Stack & ML Developer" },
};
export const viewport = { themeColor: "#090909" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('build')}catch(e){}" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@500;700&family=Manrope:wght@400;500;600;700;800&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
