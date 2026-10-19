import "./globals.css";

export const metadata = {
  title: "Saad Naeem | Full-Stack & ML Developer",
  description: "Saad Naeem is a full-stack developer and machine-learning enthusiast building web apps with React, Next.js, Node.js, MongoDB and Python.",
  authors: [{ name: "Saad Naeem" }],
  keywords: ["Saad Naeem", "full stack developer", "MERN", "React", "Next.js", "Python", "machine learning", "Urdu OCR"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@300,400,500,600&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
