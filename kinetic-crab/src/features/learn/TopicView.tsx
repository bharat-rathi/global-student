import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { ChevronLeft, BookOpen, Gamepad2, CheckCircle2 } from 'lucide-react';
import { StoryViewer } from './StoryViewer';
import { cn } from '../../lib/utils';
import { QuizRace } from '../games/QuizRace';
import { BattleArena } from '../games/BattleArena';
import { TOPICS } from '../../data/topics';
import { type Difficulty } from '../../data/questions';

type ViewMode = 'story' | 'game';
type GameType = 'quiz' | 'battle';

export const TopicView = () => {
    const { subject, topicId } = useParams<{ subject: string; topicId: string }>();
    const [mode, setMode] = useState<ViewMode>('story');
    const [gameType, setGameType] = useState<GameType>('quiz');
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');

    // Find Topic Title
    const subjectTopics = TOPICS[subject || 'math'] || [];
    const topic = subjectTopics.find(t => t.id === topicId);
    const topicTitle = topic?.title || "Unknown Topic";

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link to={`/learn/${subject}`}>
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{topicTitle}</h1>
                        <p className="text-muted-foreground text-sm">Topic {topicId}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4 items-center">
                    {/* Difficulty Selector (Only visible in game mode) */}
                    {mode === 'game' && (
                        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    className={cn(
                                        "px-3 py-1.5 rounded text-xs font-medium transition-all capitalize",
                                        difficulty === d
                                            ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50"
                                            : "text-muted-foreground hover:text-white"
                                    )}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Game Selector (Only visible in game mode) */}
                    {mode === 'game' && (
                        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                            <button
                                onClick={() => setGameType('quiz')}
                                className={cn(
                                    "px-3 py-1.5 rounded text-xs font-medium transition-all",
                                    gameType === 'quiz' ? "bg-blue-600 text-white" : "text-muted-foreground hover:text-white"
                                )}
                            >
                                Quiz Race
                            </button>
                            <button
                                onClick={() => setGameType('battle')}
                                className={cn(
                                    "px-3 py-1.5 rounded text-xs font-medium transition-all",
                                    gameType === 'battle' ? "bg-red-600 text-white" : "text-muted-foreground hover:text-white"
                                )}
                            >
                                Battle Arena
                            </button>
                        </div>
                    )}

                    {/* Mode Switcher */}
                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setMode('story')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                mode === 'story' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            <BookOpen className="w-4 h-4" />
                            Lesson
                        </button>
                        <button
                            onClick={() => setMode('game')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                mode === 'game' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            <Gamepad2 className="w-4 h-4" />
                            Practice
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <Card className="flex-1 overflow-hidden border-white/10 bg-black/20 backdrop-blur-xl">
                <CardContent className="p-0 h-full">
                    {mode === 'story' ? (
                        <StoryViewer 
                            topic={topicTitle} 
                            onComplete={() => setMode('game')} 
                        />
                    ) : (
                        <div className="h-full">
                            {gameType === 'quiz' ? (
                                <QuizRace subject={subject} topicId={topicId} difficulty={difficulty} />
                            ) : (
                                <BattleArena subject={subject} topicId={topicId} difficulty={difficulty} />
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
