// src/data/quotes.js

export const QUOTES = [
  {
    id: 1,
    text: "Dil dhoondta hai phir wahi, fursat ke raat din.",
    translation: "The heart searches again for those leisurely days and nights.",
    poet: "Gulzar",
    source: "Mausam (1975)",
  },
  {
    id: 2,
    text: "Ranjish hi sahi, dil hi dukhane ke liye aa.",
    translation: "Even if it brings pain — come, if only to hurt this heart.",
    poet: "Ahmad Faraz",
    source: "Ghazal",
  },
  {
    id: 3,
    text: "Hum tere shehar mein aaye hain musafir ki tarah.",
    translation: "I have come to your city like a traveler — belonging nowhere.",
    poet: "Faiz Ahmed Faiz",
    source: "Nuskha Ha-e-Wafa",
  },
  {
    id: 4,
    text: "Kuch toh log kahenge, logon ka kaam hai kehna.",
    translation: "People will say what they say — that is their work.",
    poet: "Anand Bakshi",
    source: "Amar Prem (1972)",
  },
  {
    id: 5,
    text: "Yeh jo halka halka suroor hai, yeh teri nigah ka kasoor hai.",
    translation: "This gentle intoxication — it is the fault of your gaze.",
    poet: "Traditional",
    source: "Nusrat Fateh Ali Khan",
  },
  {
    id: 6,
    text: "Kabhi kisi ko mukammal jahan nahin milta.",
    translation: "No one ever finds a world that is truly complete.",
    poet: "Nida Fazli",
    source: "Aahista Aahista (1981)",
  },
  {
    id: 7,
    text: "Ishq mein hum ne jo paya, kho ke apna aap paya.",
    translation: "In love, what we found — we found by losing ourselves.",
    poet: "Traditional",
    source: "Mehfil",
  },
  {
    id: 8,
    text: "Na koi umang hai, na koi tarang hai — meri zindagi hai kya, ek kat-ti patang hai.",
    translation: "No desire, no wave — what is my life? A kite with a cut string.",
    poet: "Traditional",
    source: "Ghazal",
  },
]

export const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)]
