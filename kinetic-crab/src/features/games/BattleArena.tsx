import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Shield, Sword, Heart, Zap, Skull, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const QUESTIONS = [
    { id: 1, question: "Solve for x: 2x = 10", options: ["2", "5", "10", "20"], answer: 1, damage: 20 },
    { id: 2, question: "What is the square root of 64?", options: ["6", "7", "8", "9"], answer: 2, damage: 25 },
    { id: 3, question: "12 x 12 = ?", options: ["124", "144", "164", "122"], answer: 1, damage: 30 },
    { id: 4, question: "What is 50% of 80?", options: ["40", "20", "60", "30"], answer: 0, damage: 25 },
    { id: 5, question: "Solve: 3 + 4 x 2", options: ["14", "11", "10", "24"], answer: 1, damage: 35 }, // PEMDAS trap
];

const MAX_HEALTH = 100;

export const BattleArena = () => {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost'>('start');
    const [playerHealth, setPlayerHealth] = useState(MAX_HEALTH);
    const [enemyHealth, setEnemyHealth] = useState(MAX_HEALTH);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [combatLog, setCombatLog] = useState<string[]>([]);
    const [isAttacking, setIsAttacking] = useState<'player' | 'enemy' | null>(null);

    const startGame = () => {
        setGameState('playing');
        setPlayerHealth(MAX_HEALTH);
        setEnemyHealth(MAX_HEALTH);
        setCurrentQuestion(0);
        setCombatLog(["Battle Started! Defeat the Void Creature!"]);
        setIsAttacking(null);
    };

    const handleAnswer = (index: number) => {
        if (isAttacking) return;

        const correct = index === QUESTIONS[currentQuestion].answer;
        const damage = QUESTIONS[currentQuestion].damage;

        if (correct) {
            // Player Turn
            setIsAttacking('player');
            setCombatLog(prev => [`You used Knowledge Strike! Dealt ${damage} damage!`, ...prev]);

            setTimeout(() => {
                setEnemyHealth(prev => Math.max(0, prev - damage));
                setIsAttacking(null);

                // Check Win
                if (enemyHealth - damage <= 0) {
                    setGameState('won');
                } else {
                    nextQuestion();
                }
            }, 1000);
        } else {
            // Enemy Turn
            setIsAttacking('enemy');
            const enemyDamage = 15 + Math.floor(Math.random() * 10);
            setCombatLog(prev => [`Wrong answer! Void Creature attacks for ${enemyDamage} damage!`, ...prev]);

            setTimeout(() => {
                setPlayerHealth(prev => Math.max(0, prev - enemyDamage));
                setIsAttacking(null);

                // Check Loss
                if (playerHealth - enemyDamage <= 0) {
                    setGameState('lost');
                } else {
                    nextQuestion();
                }
            }, 1000);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            // Ran out of questions - if enemy still alive, maybe draw or sudden death? 
            // For prototype, let's just say you survived but didn't win if enemy > 0
            if (enemyHealth > 0) setGameState('lost');
        }
    };

    if (gameState === 'start') {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <Sword className="w-12 h-12 text-red-500" />
                </div>
                <div>
                    <h2 className="text-4xl font-bold mb-2">Battle Arena</h2>
                    <p className="text-muted-foreground text-lg">Defeat the boss by answering correctly!</p>
                </div>
                <Button size="lg" className="text-lg px-12 py-6 rounded-xl bg-red-600 hover:bg-red-700" onClick={startGame}>
                    Enter Arena
                </Button>
            </div>
        );
    }

    if (gameState === 'won') {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Shield className="w-12 h-12 text-yellow-500" />
                </div>
                <h2 className="text-4xl font-bold text-yellow-500">Victory!</h2>
                <p className="text-xl text-muted-foreground">The Void Creature has been vanquished.</p>
                <Button onClick={startGame} className="gap-2">
                    <RotateCcw className="w-4 h-4" /> Play Again
                </Button>
            </div>
        );
    }

    if (gameState === 'lost') {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center">
                    <Skull className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-4xl font-bold text-red-500">Defeated...</h2>
                <p className="text-xl text-muted-foreground">Study hard and try again!</p>
                <Button onClick={startGame} variant="outline" className="gap-2">
                    <RotateCcw className="w-4 h-4" /> Retry Level
                </Button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col max-w-5xl mx-auto p-4 md:p-8 gap-8">
            {/* Battle Scene */}
            <div className="flex justify-between items-center relative h-64 bg-black/40 rounded-2xl border border-white/10 p-8 overflow-hidden">
                {/* Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-red-900/10" />

                {/* Player */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="relative">
                        <motion.div
                            animate={isAttacking === 'player' ? { x: 100 } : { x: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="w-24 h-24 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50"
                        >
                            <Shield className="w-12 h-12 text-white" />
                        </motion.div>
                        {isAttacking === 'enemy' && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: 1, y: -20 }}
                                exit={{ opacity: 0 }}
                                className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-500 font-bold text-2xl"
                            >
                                -Damage
                            </motion.div>
                        )}
                    </div>
                    <div className="w-48 space-y-1">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Hero</span>
                            <span>{playerHealth}/{MAX_HEALTH}</span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-green-500"
                                initial={{ width: "100%" }}
                                animate={{ width: `${(playerHealth / MAX_HEALTH) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>

                {/* VS */}
                <div className="z-10 text-4xl font-black text-white/20 italic">VS</div>

                {/* Enemy */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="relative">
                        <motion.div
                            animate={isAttacking === 'enemy' ? { x: -100 } : { x: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/50"
                        >
                            <Skull className="w-12 h-12 text-white" />
                        </motion.div>
                        {isAttacking === 'player' && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: 1, y: -20 }}
                                exit={{ opacity: 0 }}
                                className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 font-bold text-2xl"
                            >
                                CRITICAL!
                            </motion.div>
                        )}
                    </div>
                    <div className="w-48 space-y-1">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Void Creature</span>
                            <span>{enemyHealth}/{MAX_HEALTH}</span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-red-500"
                                initial={{ width: "100%" }}
                                animate={{ width: `${(enemyHealth / MAX_HEALTH) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                {/* Combat Log */}
                <Card className="col-span-1 bg-black/20 border-white/10 overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-white/10 bg-white/5 font-medium text-sm">Combat Log</div>
                    <div className="p-4 space-y-2 overflow-y-auto flex-1 max-h-[200px] text-sm text-muted-foreground">
                        {combatLog.map((log, i) => (
                            <div key={i} className="animate-in slide-in-from-left-2">{log}</div>
                        ))}
                    </div>
                </Card>

                {/* Question & Options */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold">{QUESTIONS[currentQuestion].question}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {QUESTIONS[currentQuestion].options.map((option, index) => (
                            <Button
                                key={index}
                                variant="secondary"
                                className="h-16 text-xl hover:bg-primary hover:text-white transition-all"
                                onClick={() => handleAnswer(index)}
                                disabled={isAttacking !== null}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
