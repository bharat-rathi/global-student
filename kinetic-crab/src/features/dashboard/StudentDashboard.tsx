import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Flame, Star, Trophy, ArrowRight, BookOpen, Atom, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                        Welcome back, <span className="text-primary">Explorer!</span>
                    </h1>
                    <p className="text-muted-foreground text-lg mt-2">
                        Ready to continue your journey to global citizenship?
                    </p>
                </div>

                {/* Daily Streak Card */}
                <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-orange-500/20 text-orange-500">
                            <Flame className="w-6 h-6 fill-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-orange-200">Daily Streak</p>
                            <p className="text-2xl font-bold text-orange-500">3 Days</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Math Card */}
                <Link to="/learn/math" className="group">
                    <Card className="h-full hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all" />
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Calculator className="w-6 h-6 text-blue-400" />
                            </div>
                            <CardTitle className="text-2xl group-hover:text-blue-400 transition-colors">Mathematics</CardTitle>
                            <CardDescription>Master numbers, geometry, and logic.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium text-blue-400">42%</span>
                                </div>
                                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[42%]" />
                                </div>
                                <Button className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors" variant="secondary">
                                    Continue Learning <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Science Card */}
                <Link to="/learn/science" className="group">
                    <Card className="h-full hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-green-500/20 transition-all" />
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Atom className="w-6 h-6 text-green-400" />
                            </div>
                            <CardTitle className="text-2xl group-hover:text-green-400 transition-colors">Science</CardTitle>
                            <CardDescription>Explore the universe, matter, and life.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium text-green-400">28%</span>
                                </div>
                                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                    <div className="h-full bg-green-500 w-[28%]" />
                                </div>
                                <Button className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors" variant="secondary">
                                    Continue Learning <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Recent Achievements */}
            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Recent Achievements
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { name: 'First Steps', desc: 'Completed first lesson', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                        { name: 'Math Whiz', desc: 'Scored 100% in Quiz', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                        { name: 'Early Bird', desc: 'Logged in before 8AM', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                        { name: 'Locked', desc: 'Keep playing to unlock!', color: 'text-muted-foreground', bg: 'bg-white/5' },
                    ].map((badge, i) => (
                        <Card key={i} className="border-white/5 bg-white/5">
                            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                                <div className={`w-12 h-12 rounded-full ${badge.bg} flex items-center justify-center`}>
                                    <Star className={`w-6 h-6 ${badge.color}`} />
                                </div>
                                <div>
                                    <p className="font-medium">{badge.name}</p>
                                    <p className="text-xs text-muted-foreground">{badge.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
