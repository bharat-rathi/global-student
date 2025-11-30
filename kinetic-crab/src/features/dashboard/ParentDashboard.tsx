import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Trophy, Clock, Settings, Plus } from 'lucide-react';

export const ParentDashboard = () => {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
                    <p className="text-muted-foreground">Monitor your children's progress and settings.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Child
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Child Card */}
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                            TS
                        </div>
                        <div>
                            <CardTitle className="text-xl">Test Student</CardTitle>
                            <CardDescription>Grade 6 • Active today</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    <span className="text-xs font-medium">Mastery</span>
                                </div>
                                <p className="text-2xl font-bold">12%</p>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs font-medium">Time</span>
                                </div>
                                <p className="text-2xl font-bold">45m</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Current Topic</span>
                                <span className="font-medium text-primary">Matter & Atoms</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                <div className="h-full bg-primary w-[60%]" />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-2">
                            <Button className="w-full" variant="secondary">View Report</Button>
                            <Button size="icon" variant="ghost">
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Add New Child Placeholder */}
                <Card className="border-dashed border-white/20 bg-transparent hover:bg-white/5 transition-colors flex items-center justify-center p-6">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                            <Plus className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium">Link Another Child</h3>
                        <p className="text-sm text-muted-foreground">Add up to 5 accounts</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};
