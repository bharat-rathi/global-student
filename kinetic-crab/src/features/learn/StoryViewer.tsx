import React, { useEffect, useState } from 'react';
import { generateStory } from '../../lib/ai';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryViewerProps {
    topic: string;
    subject: string;
    onComplete: () => void;
}

interface Scene {
    text: string;
    visual_cue: string;
    background_theme: "space" | "jungle" | "ocean" | "lab" | "sunset";
    character_emoji: string;
}

interface StoryData {
    title: string;
    scenes: Scene[];
}

const themeImages = {
    space: "/assets/story_bg_space.png",
    jungle: "/assets/story_bg_jungle.png", // Will fallback if missing or handled by error
    ocean: "/assets/story_bg_ocean.png",
    lab: "/assets/story_bg_lab.png",
    sunset: "/assets/story_bg_sunset.png"
};

const themeColors = {
    space: "from-indigo-900 to-purple-900",
    jungle: "from-green-900 to-emerald-800",
    ocean: "from-blue-900 to-cyan-800",
    lab: "from-slate-900 to-blue-900",
    sunset: "from-orange-900 to-red-900"
};

export const StoryViewer: React.FC<StoryViewerProps> = ({ topic, subject, onComplete }) => {
    const [story, setStory] = useState<StoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sceneIndex, setSceneIndex] = useState(0);

    useEffect(() => {
        const fetchStory = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await generateStory(topic, subject);
                setStory(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Failed to generate story.');
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [topic, subject]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Sparkles className="w-12 h-12 text-yellow-400" />
                </motion.div>
                <p className="text-xl text-white font-medium animate-pulse">Professor Crab is preparing the mission...</p>
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

    const currentScene = story.scenes[sceneIndex];
    // Normalize to lowercase to handle AI inconsistencies
    const normalizedTheme = (currentScene.background_theme?.toLowerCase() || 'space') as keyof typeof themeImages; 
    const bgImage = themeImages[normalizedTheme] || themeImages.space;
    console.log('DEBUG: Theme:', currentScene.background_theme, 'Normalized:', normalizedTheme, 'Image URL:', bgImage);
    const fallbackColor = themeColors[normalizedTheme] || themeColors.space;

    return (
        <Card className={`max-w-4xl mx-auto border-0 shadow-2xl overflow-hidden bg-gradient-to-br ${fallbackColor} relative transition-all duration-1000`}>
            
            {/* Background Image Layer */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 z-0"
                style={{ 
                    backgroundImage: `url('${bgImage}')`,
                    // Force visibility for debugging
                    opacity: 1 
                }}
            >
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            </div>
            


            <CardContent className="p-0 min-h-[500px] flex flex-col md:flex-row relative z-10">
                
                {/* Visual Side (Left/Top) - Character Focus */}
                <div className="flex-1 flex flex-col items-center justify-center p-12 relative">
                    <motion.div
                        key={`emoji-${sceneIndex}`}
                        initial={{ scale: 0, rotate: -20, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="text-9xl filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] z-20"
                    >
                        {currentScene.character_emoji}
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 text-white text-shadow-lg font-bold text-lg bg-black/30 px-6 py-2 rounded-full border border-white/20 backdrop-blur-md"
                    >
                        {currentScene.background_theme.toUpperCase()}
                    </motion.div>
                </div>

                {/* Narrative Side (Right/Bottom) */}
                <div className="flex-1 bg-black/60 backdrop-blur-md border-t md:border-t-0 md:border-l border-white/10 p-8 flex flex-col justify-between shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <BookOpen className="text-yellow-400 w-5 h-5" />
                            <h2 className="text-xl font-bold text-white/90 drop-shadow-md">{story.title}</h2>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`text-${sceneIndex}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-2xl md:text-3xl font-medium text-white leading-relaxed drop-shadow-lg">
                                    "{currentScene.text}"
                                </div>
                                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 text-sm text-blue-100 flex items-start gap-2">
                                    <Sparkles className="w-4 h-4 mt-0.5 text-blue-300 shrink-0" />
                                    <span>{currentScene.visual_cue}</span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 flex justify-end pt-6 border-t border-white/10">
                        {sceneIndex < story.scenes.length - 1 ? (
                            <Button 
                                onClick={() => setSceneIndex(prev => prev + 1)}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-6 text-lg rounded-xl group transition-all"
                            >
                                Next 
                                <span className="group-hover:translate-x-1 transition-transform ml-2">→</span>
                            </Button>
                        ) : (
                            <Button 
                                onClick={onComplete}
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold px-8 py-6 text-xl rounded-xl shadow-[0_0_20px_rgba(255,165,0,0.4)] transform hover:scale-105 transition-all"
                            >
                                Start Mission! 🚀
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>

            {/* Progress Dots */}
            <div className="absolute bottom-6 left-8 flex gap-2 z-20">
                {story.scenes.map((_, i) => (
                    <div 
                        key={i}
                        className={`transition-all duration-300 shadow-lg ${i === sceneIndex ? 'bg-yellow-400 w-8 h-2 rounded-full' : 'bg-white/30 w-2 h-2 rounded-full'}`}
                    />
                ))}
            </div>
        </Card>
    );
};
