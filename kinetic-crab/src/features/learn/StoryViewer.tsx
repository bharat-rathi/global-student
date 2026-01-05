import React, { useEffect, useState } from 'react';
import { generateStory } from '../../lib/ai';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface StoryViewerProps {
    topic: string;
    onComplete: () => void;
}

interface StoryData {
    title: string;
    content: string[];
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ topic, onComplete }) => {
    const [story, setStory] = useState<StoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchStory = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await generateStory(topic);
                setStory(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Failed to generate story.');
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [topic]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Sparkles className="w-12 h-12 text-yellow-400" />
                </motion.div>
                <p className="text-xl text-white font-medium animate-pulse">Professor Crab is writing your mission...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive/50 bg-destructive/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle />
                        Mission Error
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error}</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={onComplete} variant="outline">Skip Story</Button>
                </CardFooter>
            </Card>
        );
    }

    if (!story) return null;

    return (
        <Card className="max-w-3xl mx-auto border-purple-500/30 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                        {story.title}
                    </CardTitle>
                    <BookOpen className="text-purple-400 w-6 h-6" />
                </div>
                <CardDescription className="text-slate-300">
                    Mission Briefing: {topic}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-8 min-h-[300px] flex items-center justify-center relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                
                <motion.div
                    key={page}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg md:text-xl leading-relaxed text-slate-100 font-medium text-center"
                >
                    {story.content[page]}
                </motion.div>
            </CardContent>

            <CardFooter className="flex justify-between items-center bg-black/20 p-6">
                <div className="flex gap-2">
                    {story.content.map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full transition-colors ${i === page ? 'bg-yellow-400' : 'bg-white/20'}`}
                        />
                    ))}
                </div>

                <div className="flex gap-3">
                    {page > 0 && (
                        <Button 
                            variant="secondary" 
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </Button>
                    )}
                    
                    {page < story.content.length - 1 ? (
                        <Button 
                            onClick={() => setPage(p => p + 1)}
                            className="bg-blue-600 hover:bg-blue-500"
                        >
                            Next
                        </Button>
                    ) : (
                        <Button 
                            onClick={onComplete}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 shadow-lg transform hover:scale-105 transition-all"
                        >
                            Start Mission! 🚀
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
};
