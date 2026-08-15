import gandhi from "@/assets/char-gandhi.png";
import lakshmibai from "@/assets/char-lakshmibai.png";
import shivaji from "@/assets/char-shivaji.png";
import kalam from "@/assets/char-kalam.png";

export type Character = {
  id: string;
  name: string;
  short: string;
  description: string;
  image: string;
  token: string; // css color token name
};

export const CHARACTERS: Character[] = [
  {
    id: "gandhi",
    name: "Mahatma Gandhi",
    short: "Gandhi",
    description:
      "A respected leader of India's freedom movement, known for his philosophy of non-violence and simplicity.",
    image: gandhi,
    token: "p1",
  },
  {
    id: "lakshmibai",
    name: "Rani Lakshmibai",
    short: "Lakshmibai",
    description:
      "The legendary queen of Jhansi, remembered for her courage and her important role in India's history.",
    image: lakshmibai,
    token: "p2",
  },
  {
    id: "shivaji",
    name: "Chhatrapati Shivaji Maharaj",
    short: "Shivaji",
    description:
      "The influential Maratha ruler known for his leadership, administration and contribution to Indian history.",
    image: shivaji,
    token: "p3",
  },
  {
    id: "kalam",
    name: "Dr. A. P. J. Abdul Kalam",
    short: "Kalam",
    description:
      "Renowned Indian scientist and former President of India, an enduring inspiration to young people.",
    image: kalam,
    token: "p4",
  },
];

export type Question = {
  q: string;
  options: string[];
  answer: number;
};

export type Destination = {
  id: string;
  name: string;
  icon: string;
  videoId: string;
  questions: Question[];
};

export const DESTINATIONS: Record<string, Destination> = {
  taj: {
    id: "taj",
    name: "Taj Mahal",
    icon: "🕌",
    videoId: "Ephz18BZD6w",
    questions: [
      {
        q: "The Taj Mahal was built by Emperor Shah Jahan in memory of whom?",
        options: ["Nur Jahan", "Mumtaz Mahal", "Jodha Bai", "Roshanara Begum"],
        answer: 1,
      },
      {
        q: "Which material gives the Taj Mahal its famous white glow?",
        options: ["Limestone", "Granite", "White marble", "Sandstone"],
        answer: 2,
      },
    ],
  },
  redfort: {
    id: "redfort",
    name: "Red Fort",
    icon: "🏰",
    videoId: "hl5OnTX8FMg",
    questions: [
      {
        q: "In which city is the Red Fort located?",
        options: ["Agra", "Delhi", "Jaipur", "Lucknow"],
        answer: 1,
      },
      {
        q: "The Red Fort gets its name from the extensive use of which stone?",
        options: ["Red sandstone", "Red marble", "Terracotta", "Laterite"],
        answer: 0,
      },
    ],
  },
  hampi: {
    id: "hampi",
    name: "Hampi",
    icon: "🛕",
    videoId: "q1ppnZfkD60",
    questions: [
      {
        q: "Hampi was the capital of which great empire?",
        options: ["Chola Empire", "Vijayanagara Empire", "Maurya Empire", "Chalukya Empire"],
        answer: 1,
      },
      {
        q: "Hampi is located in which present-day Indian state?",
        options: ["Karnataka", "Telangana", "Maharashtra", "Tamil Nadu"],
        answer: 0,
      },
    ],
  },
  konark: {
    id: "konark",
    name: "Konark Sun Temple",
    icon: "☀️",
    videoId: "58gLxcERMbs",
    questions: [
      {
        q: "The Konark temple is designed in the shape of what?",
        options: ["A lotus", "A ship", "A giant chariot", "A mountain"],
        answer: 2,
      },
      {
        q: "Konark Sun Temple is dedicated to which deity?",
        options: ["Surya, the Sun God", "Shiva", "Vishnu", "Indra"],
        answer: 0,
      },
    ],
  },
  ajanta: {
    id: "ajanta",
    name: "Ajanta Caves",
    icon: "🖼️",
    videoId: "y4QUOHu2Mfs",
    questions: [
      {
        q: "The Ajanta Caves are most famous for their ancient what?",
        options: ["Iron pillars", "Mural paintings", "Stained glass", "Mosaic floors"],
        answer: 1,
      },
      {
        q: "The Ajanta Caves are associated mainly with which religion?",
        options: ["Jainism", "Buddhism", "Sikhism", "Zoroastrianism"],
        answer: 1,
      },
    ],
  },
  ellora: {
    id: "ellora",
    name: "Ellora Caves",
    icon: "⛰️",
    videoId: "caYN9mlFBU0",
    questions: [
      {
        q: "The famous Kailasa Temple at Ellora was carved out of what?",
        options: [
          "Assembled stone blocks",
          "A single rock",
          "Baked bricks",
          "Timber and plaster",
        ],
        answer: 1,
      },
      {
        q: "Ellora's caves represent how many religions?",
        options: ["One", "Two", "Three", "Five"],
        answer: 2,
      },
    ],
  },
  sanchi: {
    id: "sanchi",
    name: "Sanchi Stupa",
    icon: "🔔",
    videoId: "cKf05fr6-_M",
    questions: [
      {
        q: "The Great Stupa at Sanchi was originally commissioned by which emperor?",
        options: ["Ashoka", "Chandragupta II", "Harsha", "Kanishka"],
        answer: 0,
      },
      {
        q: "The carved gateways of the Sanchi Stupa are called what?",
        options: ["Gopurams", "Toranas", "Vimanas", "Mandapas"],
        answer: 1,
      },
    ],
  },
};

/** Total tiles on the spiral, index 0 = start (outer), last = centre. */
export const TILE_COUNT = 44;

/** Selected special heritage spaces — most tiles are plain movement spaces. */
export const DESTINATION_TILES: Record<number, string> = {
  5: "taj",
  11: "redfort",
  16: "hampi",
  22: "konark",
  28: "ajanta",
  33: "ellora",
  39: "sanchi",
};

/** Archimedean spiral positions in percent of the square board. */
export function spiralPositions(count = TILE_COUNT) {
  const turns = 2.6;
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const angle = t * turns * Math.PI * 2 + Math.PI;
    const radius = i === count - 1 ? 0 : 45 * (1 - t) + 13 * t;
    out.push({
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    });
  }
  return out;
}
