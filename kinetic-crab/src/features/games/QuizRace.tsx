import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Timer, Zap, CheckCircle, XCircle, Trophy, RotateCcw, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { getQuestions, type Question, type Difficulty } from '../../data/questions';
import { useProgressStore } from '../../store/useProgressStore';
import { useQuestionStore } from '../../store/useQuestionStore';

interface QuizRaceProps {
    subject?: string;
    topicId?: string;
    difficulty?: Difficulty;
    onComplete?: (score: number) => void;
}

export const QuizRace = ({ subject = 'math', topicId = 'm1', difficulty, onComplete }: QuizRaceProps) => {
    const { addXp, completeTopic, unlockAchievement } = useProgressStore();
    const { customQuestions } = useQuestionStore();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [gameState, setGameState] = useState<'loading' | 'start' | 'playing' | 'finished'>('loading');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        // Get default questions
        const defaultQuestions = getQuestions(subject, topicId, difficulty);

        // Filter custom questions for this subject/topic
        // (For prototype, we'll include all custom questions if subject matches, or just mix them in)
        const relevantCustomQuestions = customQuestions.filter(q =>
            q.subject === subject && (topicId ? q.topicId === topicId : true)
        );

        // Combine and shuffle
        const allQuestions = [...defaultQuestions, ...relevantCustomQuestions];
        const shuffled = allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);

        setQuestions(shuffled);
        console.log(`[QuizRace] State updated. Questions count: ${shuffled.length}`);
        setGameState('start');
    }, [subject, topicId, difficulty, customQuestions]);

    useEffect(() => {
        let timer: any;
        if (gameState === 'playing' && timeLeft > 0 && selectedOption === null) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            handleAnswer(-1); // Time out
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, selectedOption]);

    const startGame = () => {
        if (questions.length === 0) return;
        setGameState('playing');
        setCurrentQuestion(0);
        setScore(0);
        setStreak(0);
        setTimeLeft(30);
        setSelectedOption(null);
        setIsCorrect(null);
    };

    const handleAnswer = (index: number) => {
        if (selectedOption !== null) return; // Prevent multiple clicks

        setSelectedOption(index);

        // Handle timeout (-1)
        const correct = index === questions[currentQuestion].answer;
        setIsCorrect(correct);

        if (correct) {
            setScore((prev) => prev + 10 + (streak * 2)); // Streak bonus
            setStreak((prev) => prev + 1);
        } else {
            setStreak(0);
        }

        // Wait before next question
        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion((prev) => prev + 1);
                setSelectedOption(null);
                setIsCorrect(null);
                setTimeLeft(30);
            } else {
                finishGame();
            }
        }, 1500);
    };

    const finishGame = () => {
        setGameState('finished');

        // Save Progress
        addXp(score);
        completeTopic(topicId, score);

        // Check Achievements
        unlockAchievement('first_win');
        if (streak >= 7) unlockAchievement('streak_master');
        if (subject === 'math' && score >= questions.length * 10) unlockAchievement('math_whiz');

        if (onComplete) onComplete(score);
    };

    if (gameState === 'loading') {
        return <div className="flex items-center justify-center h-full">Loading Questions...</div>;
    }

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                <AlertCircle className="w-12 h-12 text-yellow-500" />
                <h3 className="text-xl font-bold">No Questions Found</h3>
                <p className="text-muted-foreground">Try selecting a different topic or difficulty.</p>
            </div>
        );
    }

    if (gameState === 'start') {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <Zap className="w-12 h-12 text-yellow-500" />
                </div>
                <div>
                    <h2 className="text-4xl font-bold mb-2">Quiz Race</h2>
                    <p className="text-muted-foreground text-lg">
                        {questions.length} Questions • {difficulty ? difficulty.toUpperCase() : 'MIXED'} Difficulty
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">Answer fast for streak bonuses!</p>
                </div>
                <Button size="lg" className="text-lg px-12 py-6 rounded-xl" onClick={startGame}>
                    Start Race
                </Button>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <Trophy className="w-24 h-24 text-yellow-500 mb-4" />
                <h2 className="text-4xl font-bold">Race Complete!</h2>
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 w-full max-w-md space-y-4">
                    <div className="flex justify-between items-center text-lg">
                        <span className="text-muted-foreground">Final Score</span>
                        <span className="font-bold text-2xl text-primary">{score}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                        <span className="text-muted-foreground">Accuracy</span>
                        <span className="font-bold text-2xl text-green-500">
                            {Math.round((score / (questions.length * 10)) * 100)}%
                        </span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={startGame} className="gap-2">
                        <RotateCcw className="w-4 h-4" /> Play Again
                    </Button>
                    <Button className="gap-2">
                        Next Topic <Zap className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        );
    }

    const q = questions[currentQuestion];

    return (
        <div className="h-full flex flex-col max-w-4xl mx-auto p-8">
            {/* HUD */}
            <div className="flex items-center justify-between mb-8 bg-black/40 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-yellow-500">
                        <Zap className="w-5 h-5 fill-current" />
                        <span className="font-bold text-xl">{streak}x Streak</span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="text-xl font-bold">Score: {score}</div>
                </div>
                <div className="flex items-center gap-2 text-xl font-mono">
                    <Timer className={cn("w-5 h-5", timeLeft < 10 ? "text-red-500 animate-pulse" : "text-blue-400")} />
                    <span className={cn(timeLeft < 10 ? "text-red-500" : "text-blue-400")}>{timeLeft}s</span>
                </div>
            </div>

            {/* Question Area */}
            <div className="flex-1 flex flex-col justify-center space-y-8">
                <div className="text-center space-y-4">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <h3 className="text-4xl font-bold leading-tight">
                        {q.question}
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={selectedOption !== null}
                            className={cn(
                                "p-6 rounded-xl border-2 text-xl font-medium transition-all duration-200 relative overflow-hidden group",
                                selectedOption === null
                                    ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 hover:scale-[1.02]"
                                    : selectedOption === index
                                        ? isCorrect
                                            ? "border-green-500 bg-green-500/20 text-green-500"
                                            : "border-red-500 bg-red-500/20 text-red-500"
                                        : index === q.answer && selectedOption !== null
                                            ? "border-green-500 bg-green-500/20 text-green-500 opacity-100" // Show correct answer if wrong
                                            : "border-white/5 bg-white/5 opacity-50"
                            )}
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <span>{option}</span>
                                {selectedOption === index && (
                                    isCorrect
                                        ? <CheckCircle className="w-6 h-6" />
                                        : <XCircle className="w-6 h-6" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
};
