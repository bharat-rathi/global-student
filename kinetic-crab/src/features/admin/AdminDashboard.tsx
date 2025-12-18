import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useQuestionStore } from '../../store/useQuestionStore';
import { CurriculumUpload } from './CurriculumUpload';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Users, BookOpen, Activity, Settings, Key } from 'lucide-react';

export const AdminDashboard = () => {
    const { user } = useAuthStore();
    const { apiKey, setApiKey } = useQuestionStore();
    const [tempKey, setTempKey] = useState(apiKey || '');
    const [isKeySaved, setIsKeySaved] = useState(!!apiKey);

    const handleSaveKey = () => {
        setApiKey(tempKey);
        setIsKeySaved(true);
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage curriculum and monitor platform activity.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                    <Settings className="w-4 h-4" />
                    <span className="font-bold">Admin Mode</span>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Students
                        </CardTitle>
                        <Users className="w-4 h-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">1,234</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Topics
                        </CardTitle>
                        <BookOpen className="w-4 h-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">24</div>
                        <p className="text-xs text-muted-foreground">Across Math & Science</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            System Status
                        </CardTitle>
                        <Activity className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Operational</div>
                        <p className="text-xs text-muted-foreground">All systems normal</p>
                    </CardContent>
                </Card>
            </div>

            {/* API Key Configuration */}
            <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Key className="w-5 h-5 text-yellow-400" />
                        AI Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <Input
                                label="Gemini API Key"
                                type="password"
                                placeholder="Enter your Gemini API Key"
                                value={tempKey}
                                onChange={(e) => {
                                    setTempKey(e.target.value);
                                    setIsKeySaved(false);
                                }}
                            />
                        </div>
                        <Button
                            onClick={handleSaveKey}
                            disabled={isKeySaved || !tempKey}
                            className={isKeySaved ? "bg-green-600" : "bg-blue-600"}
                        >
                            {isKeySaved ? "Saved" : "Save Key"}
                        </Button>
                    </div>
                    {/* Diagnostic Tool */}
                    <div className="mt-4 border-t border-slate-700 pt-4">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                                try {
                                    alert('Testing Connection... This may take 10 seconds.');
                                    const { validateApiKey } = await import('../../lib/gemini');
                                    const models = await validateApiKey(tempKey);
                                    alert(`SUCCESS! Working Models: \n${models.join('\n')}`);
                                } catch (e: any) {
                                    alert(`ERROR: ${e.message}`);
                                }
                            }}
                        >
                            Test Connection / Find Models
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Required for generating questions from curriculum files. Keys are stored locally in your browser.
                    </p>
                </CardContent>
            </Card>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Curriculum Upload Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        Curriculum Management
                    </h2>
                    <CurriculumUpload />
                </div>

                {/* Recent Activity / Logs (Placeholder) */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-slate-400" />
                        Recent Logs
                    </h2>
                    <Card className="bg-slate-900/50 border-slate-700">
                        <CardContent className="p-4 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3 items-start text-sm border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500" />
                                    <div>
                                        <p className="text-slate-300">New curriculum file uploaded</p>
                                        <p className="text-xs text-slate-500">2 hours ago • Admin User</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* Version Indicator */}
            <div className="text-center text-slate-600 text-xs mt-8">
                v1.4.0 (Diagnostics Tool)
            </div>
        </div>
    );
};
