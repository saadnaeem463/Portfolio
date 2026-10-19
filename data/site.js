// ✏️ Edit your portfolio content here.
const GH = "https://github.com/saadnaeem463";
export const site = {
  name: "Saad Naeem",
  role: "Full Stack Developer & ML Enthusiast",
  bio: "I build full-stack web apps with the MERN stack and use Python to make machine learning do something useful. From a real-time civic issue tracker to a deep-learning OCR that reads Urdu, I like projects where the idea, the data and the interface all have to work together.",
  tagline: "Full-stack + ML. Built to be used, not just to run.",
  email: "saadnaeem463@gmail.com",
  linkedin: "https://www.linkedin.com/in/saad-naeem-5138a3409",
  github: GH,
  githubUser: "saadnaeem463",
  location: "Karachi, Pakistan",
};

export const flagship = [
  { title: "Market Hall", group: "Full-Stack", img: "market-hall", alt: "Market Hall MERN marketplace",
    desc: "Full-stack e-commerce marketplace with category browsing, a shopping bag and order flow, and real-time updates over Socket.io.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Socket.io"], code: `${GH}/MERN-Stack-Ecommerce`, live: "https://mern-stack-ecommerce-chi.vercel.app/" },
  { title: "CivicTrack", group: "Full-Stack", img: "civic-track", alt: "CivicTrack map of civic issues",
    desc: "Report, map and resolve civic issues in real time. An interactive map and dashboard show reported issues, with live updates powered by Pusher.",
    tech: ["Next.js", "MongoDB", "Pusher", "shadcn/ui"], code: `${GH}/Full-Stack-Civic-Tracker`, live: "https://full-stack-civic-tracker.vercel.app/" },
  { title: "Urdu OCR Studio", group: "Machine Learning", img: "urdu-ocr", alt: "Urdu OCR Studio app",
    desc: "Turns photos and scans of printed Urdu into clean, readable text. A CRNN + CTC deep-learning model behind a Streamlit app that handles single lines and multi-line pages.",
    tech: ["Python", "CRNN", "CTC", "Streamlit"], code: `${GH}/Urdu-Optical-Character-Recognition-OCR-Deep-Learning`,
    live: "https://urdu-optical-character-recognition-ocr-deep-learning.streamlit.app/" },
];

export const more = [
  { title: "Heart Attack Predictor", img: "heart-predictor", alt: "Heart Attack Predictor app",
    desc: "A machine-learning web app that estimates heart-attack risk from a few patient inputs.",
    features: ["Inputs for age, sex, blood pressure, cholesterol and max heart rate", "Classifier-based risk prediction built with scikit-learn", "Data prepared and explored with Pandas", "Model developed and evaluated in a Jupyter Notebook", "Deployed as an interactive Streamlit app"],
    tech: ["Python", "scikit-learn", "Pandas", "Streamlit"], code: `${GH}/Heart-Attack-Predictor`, live: "https://heart-attack-predictorr.streamlit.app/" },
  { title: "Expense Tracker", img: "expense-tracker", alt: "Expense Tracker dashboard",
    desc: "Track income, expenses and spending by category from one clean dashboard.",
    features: ["Dashboard with current balance, income and expenses", "Add and review transactions", "Spending breakdown by category", "Report view for a quick overview", "Built with React and TypeScript"],
    tech: ["React", "TypeScript"], code: `${GH}/Expense-Tracker`, live: "https://expense-tracker-a77w.vercel.app/" },
];

const si = (n) => `https://skillicons.dev/icons?i=${n}`;
export const stack = [
  ["JavaScript", si("js")], ["TypeScript", si("ts")], ["React", si("react")], ["Next.js", si("nextjs")], ["Node.js", si("nodejs")], ["Express", si("express")],
  ["Python", si("py")], ["HTML", si("html")], ["CSS", si("css")], ["C++", si("cpp")], ["MongoDB", si("mongodb")], ["MySQL", si("mysql")], ["PostgreSQL", si("postgres")],
  ["Pandas", "/assets/icons/pandas.svg"], ["NumPy", "/assets/icons/numpy.svg"], ["scikit-learn", si("sklearn")], ["TensorFlow", si("tensorflow")], ["PyTorch", si("pytorch")],
  ["Matplotlib", "/assets/icons/matplotlib.svg"], ["Data Science", "/assets/icons/datascience.svg"], ["Git", si("git")], ["GitHub", si("github")], ["Postman", si("postman")], ["VS Code", si("vscode")],
];

export const education = [
  { period: "In progress", title: "FAST-NUCES", sub: "Computer Science", note: "FAST National University of Computer and Emerging Sciences, Karachi" },
];
