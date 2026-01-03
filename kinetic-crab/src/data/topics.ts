export interface Topic {
    id: string;
    title: string;
    desc: string;
    status: 'locked' | 'in-progress' | 'completed';
    stars: number;
}

export const TOPICS: Record<string, Topic[]> = {
    math: [
        { id: 'm1', title: 'Ratios & Proportions', desc: 'Understand relationships between numbers', status: 'completed', stars: 3 },
        { id: 'm2', title: 'Arithmetic Operations', desc: 'Master addition, subtraction, multiplication, division', status: 'in-progress', stars: 1 },
        { id: 'm3', title: 'Fractions & Decimals', desc: 'Working with parts of a whole', status: 'locked', stars: 0 },
        { id: 'm4', title: 'Geometry Basics', desc: 'Points, lines, and angles', status: 'locked', stars: 0 },
    ],
    science: [
        { id: 's1', title: 'Matter & Atoms', desc: 'The building blocks of the universe', status: 'in-progress', stars: 2 },
        { id: 's2', title: 'Forces & Motion', desc: 'How things move and interact', status: 'locked', stars: 0 },
        { id: 's3', title: 'Energy Types', desc: 'Kinetic, potential, and thermal energy', status: 'locked', stars: 0 },
        { id: 's4', title: 'Cells & Life', desc: 'The basic unit of life', status: 'locked', stars: 0 },
    ]
};
