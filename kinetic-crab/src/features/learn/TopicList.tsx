import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Play, CheckCircle2, Lock, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TOPICS } from '../../data/topics';

export const TopicList = () => {
    const { subject } = useParams<{ subject: 'math' | 'science' }>();
    const topics = TOPICS[subject || 'math'] || [];
    const subjectName = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : 'Subject';

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gradient">{subjectName} Curriculum</h1>
                    <p className="text-muted-foreground">Grade 6 • Global Standard</p>
                </div>
                <Link to="/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {topics.map((topic, index) => (
                    <Card
                        key={topic.id}
                        className={cn(
                            "transition-all duration-200",
                            topic.status === 'locked' ? "opacity-60 bg-white/5" : "hover:border-primary/50 hover:bg-white/10"
                        )}
                    >
                        <CardContent className="p-6 flex items-center gap-6">
                            {/* Status Icon */}
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                                topic.status === 'completed' ? "bg-green-500/20 text-green-500" :
                                    topic.status === 'in-progress' ? "bg-blue-500/20 text-blue-500" :
                                        "bg-white/5 text-muted-foreground"
                            )}>
                                {topic.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> :
                                    topic.status === 'in-progress' ? <Play className="w-6 h-6 fill-current" /> :
                                        <Lock className="w-6 h-6" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-semibold">{index + 1}. {topic.title}</h3>
                                    {topic.stars > 0 && (
                                        <div className="flex gap-0.5">
                                            {[...Array(3)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={cn(
                                                        "w-4 h-4",
                                                        i < topic.stars ? "fill-yellow-500 text-yellow-500" : "text-white/20"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-muted-foreground">{topic.desc}</p>
                            </div>

                            {/* Action Button */}
                            <div>
                                {topic.status !== 'locked' ? (
                                    <Link to={`/learn/${subject}/${topic.id}`}>
                                        <Button
                                            size="lg"
                                            className={cn(
                                                "min-w-[120px]",
                                                topic.status === 'completed' ? "bg-green-600 hover:bg-green-700" : ""
                                            )}
                                        >
                                            {topic.status === 'completed' ? 'Review' : 'Start'}
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button disabled variant="secondary" size="lg" className="min-w-[120px]">
                                        Locked
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
