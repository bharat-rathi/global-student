export type Difficulty = 'easy' | 'medium' | 'hard';
export type Subject = 'math' | 'science';

export interface Question {
    id: string;
    subject: Subject;
    topicId: string;
    difficulty: Difficulty;
    question: string;
    options: string[];
    answer: number; // index of correct option
    explanation?: string;
}

export const QUESTIONS: Question[] = [
    // --- MATH: Arithmetic Operations (m1) ---
    // Easy
    {
        id: 'm1-e1',
        subject: 'math',
        topicId: 'm1',
        difficulty: 'easy',
        question: "What is 5 + 7?",
        options: ["10", "11", "12", "13"],
        answer: 2,
        explanation: "5 plus 7 equals 12."
    },
    {
        id: 'm1-e2',
        subject: 'math',
        topicId: 'm1',
        difficulty: 'easy',
        question: "What is 15 - 6?",
        options: ["8", "9", "7", "10"],
        answer: 1,
        explanation: "15 minus 6 equals 9."
    },
    {
        id: 'm1-e3',
        subject: 'math',
        topicId: 'm1',
        difficulty: 'easy',
        question: "What is 3 x 4?",
        options: ["12", "9", "15", "7"],
        answer: 0
    },
    {
        id: 'm1-e4',
        subject: 'math',
        topicId: 'm1',
        difficulty: 'easy',
        question: "What is 20 / 4?",
        options: ["4", "5", "6", "10"],
        answer: 1
    },
    // Medium
    {
        id: 'm1-m1',
        subject: 'math',
        topicId: 'm1',
        difficulty: 'medium',
        question: "What is 12 x 12?",
        options: ["124", "144", "164", "122"],
        answer: 1
    },
    {
        id: 'm1-m2',
        subject: 'math',
        topicId: 'm1',
        difficulty: 'medium',
        question: "Solve: 3 + 4 x 2",
        options: ["14", "11", "10", "24"],
        answer: 1,
        explanation: "Order of operations (PEMDAS): Multiply first (4x2=8), then add 3 (3+8=11)."
    },
    {
        id: 'm1-m3',
        subject: 'math',
        topicId: 'm1',
        difficulty: 'medium',
        question: "What is 150 / 5?",
        options: ["30", "25", "50", "35"],
        answer: 0
    },
    {
        id: 'm1-m4',
        subject: 'math',
        topicId: 'm1',
        difficulty: 'medium',
        question: "Solve: 50 - 25 + 10",
        options: ["15", "35", "25", "45"],
        answer: 1,
        explanation: "Left to right: 50 - 25 = 25, then 25 + 10 = 35."
    },
    // Hard
    {
        id: 'm1-h1',
        subject: 'math',
        topicId: 'm1',
        difficulty: 'hard',
        question: "Solve: (12 + 8) / 4 + 5",
        options: ["9", "10", "11", "8"],
        answer: 1,
        explanation: "(20)/4 + 5 = 5 + 5 = 10"
    },
    {
        id: 'm1-h2',
        subject: 'math',
        topicId: 'm1',
        difficulty: 'hard',
        question: "Solve: 100 - 5 x 5 + 10",
        options: ["85", "485", "35", "65"],
        answer: 0,
        explanation: "PEMDAS: 5x5=25. 100 - 25 + 10. Left to right: 75 + 10 = 85."
    },
    {
        id: 'm1-h3',
        subject: 'math',
        topicId: 'm1',
        difficulty: 'hard',
        question: "What is (25 * 4) - 50?",
        options: ["25", "50", "75", "100"],
        answer: 1
    },

    // --- MATH: Fractions (m2) ---
    {
        id: 'm2-e1',
        subject: 'math',
        topicId: 'm2',
        difficulty: 'easy',
        question: "Which fraction is equal to 0.5?",
        options: ["1/3", "1/2", "1/4", "2/3"],
        answer: 1
    },
    {
        id: 'm2-m1',
        subject: 'math',
        topicId: 'm2',
        difficulty: 'medium',
        question: "Simplify: 4/12",
        options: ["1/4", "1/3", "2/6", "1/2"],
        answer: 1
    },

    // --- SCIENCE: Matter (s1) ---
    // Easy
    {
        id: 's1-e1',
        subject: 'science',
        topicId: 's1',
        difficulty: 'easy',
        question: "Which state of matter has a fixed shape?",
        options: ["Liquid", "Gas", "Solid", "Plasma"],
        answer: 2
    },
    {
        id: 's1-e2',
        subject: 'science',
        topicId: 's1',
        difficulty: 'easy',
        question: "Water freezing into ice is an example of...",
        options: ["Melting", "Freezing", "Evaporation", "Condensation"],
        answer: 1
    },
    // Medium
    {
        id: 's1-m1',
        subject: 'science',
        topicId: 's1',
        difficulty: 'medium',
        question: "What is the boiling point of water at sea level?",
        options: ["90°C", "100°C", "110°C", "120°C"],
        answer: 1
    },
    {
        id: 's1-m2',
        subject: 'science',
        topicId: 's1',
        difficulty: 'medium',
        question: "Which process turns a liquid into a gas?",
        options: ["Condensation", "Sublimation", "Evaporation", "Freezing"],
        answer: 2
    },
    // Hard
    {
        id: 's1-h1',
        subject: 'science',
        topicId: 's1',
        difficulty: 'hard',
        question: "What is the smallest unit of an element?",
        options: ["Molecule", "Atom", "Proton", "Cell"],
        answer: 1
    },
];

export const getQuestions = (subject: string, topicId: string, difficulty?: Difficulty) => {
    return QUESTIONS.filter(q =>
        q.subject === subject &&
        (topicId === 'all' || q.topicId === topicId) &&
        (!difficulty || q.difficulty === difficulty)
    );
};
