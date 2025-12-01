import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { BookOpen, Trophy, Star, Zap, ArrowRight, Target } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useProgressStore } from '../../store/useProgressStore';
import { Badge } from '../../components/gamification/Badge';
import { Leaderboard } from '../../components/gamification/Leaderboard';
import { motion } from 'framer-motion';

export const StudentDashboard = () => {
    const { user } = useAuthStore();
    const { xp, level, streak, achievements, checkStreak } = useProgressStore();

    useEffect(() => {
        checkStreak();
    }, [checkStreak]);

    // Calculate progress to next level (mock calculation)
    const xpForNextLevel = level * 1000;
    const progressPercent = (xp % 1000) / 10;

    return (
        <div className="space-y-8 pb-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Welcome back, {user?.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">Ready to learn something new today?</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-500 rounded-lg border border-yellow-500/20">
                        <Zap className="w-4 h-4 fill-current" />
                        <span className="font-bold">{streak} Day Streak</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">Lvl {level}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* XP Progress */}
                <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,transparent)]" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-400" />
                            Level Progress
                        </CardTitle>
                        <CardDescription>You need {1000 - (xp % 1000)} XP for Level {level + 1}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>{xp} XP</span>
                                <span>{xpForNextLevel} XP</span>
                            </div>
                            <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Action */}
                <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20 group cursor-pointer hover:border-green-500/50 transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-green-400" />
                            Daily Challenge
                        </CardTitle>
                        <CardDescription>Earn double XP!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20 group-hover:scale-105 transition-transform">
                            Start Challenge
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Subjects */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Your Subjects
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link to="/learn/math" className="group">
                            <Card className="h-full hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 bg-gradient-to-br from-white/5 to-transparent">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-2xl">📐</span>
                                    </div>
                                    <CardTitle>Mathematics</CardTitle>
                                    <CardDescription>Algebra, Geometry, and more</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-bold text-blue-400">65%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full w-[65%] bg-blue-500 rounded-full" />
                                        </div>
                                        <div className="pt-2 flex items-center text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
                                            Continue Learning <ArrowRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link to="/learn/science" className="group">
                            <Card className="h-full hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 bg-gradient-to-br from-white/5 to-transparent">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-2xl">🧬</span>
                                    </div>
                                    <CardTitle>Science</CardTitle>
                                    <CardDescription>Physics, Chemistry, Biology</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-bold text-purple-400">42%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full w-[42%] bg-purple-500 rounded-full" />
                                        </div>
                                        <div className="pt-2 flex items-center text-sm text-purple-400 font-medium group-hover:translate-x-1 transition-transform">
                                            Continue Learning <ArrowRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    {/* Badges Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Recent Badges
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {achievements.map((badge) => (
                                <Badge
                                    key={badge.id}
                                    title={badge.title}
                                    description={badge.description}
                                    icon={badge.icon}
                                    isUnlocked={!!badge.unlockedAt}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Leaderboard */}
                <div className="space-y-6">
                    <Leaderboard currentXp={xp} />
                </div>
            </div>
        </div>
    );
};
