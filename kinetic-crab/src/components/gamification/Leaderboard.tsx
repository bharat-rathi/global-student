import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Trophy, Medal, Crown } from 'lucide-react';
import { cn } from '../../lib/utils';

// Mock Leaderboard Data
const LEADERBOARD_DATA = [
    { id: 1, name: "Alex Johnson", xp: 12500, avatar: "👨‍🚀" },
    { id: 2, name: "Sarah Smith", xp: 11200, avatar: "👩‍🔬" },
    { id: 3, name: "Mike Brown", xp: 10800, avatar: "🦸‍♂️" },
    { id: 4, name: "Emily Davis", xp: 9500, avatar: "🧝‍♀️" },
    { id: 5, name: "You", xp: 0, avatar: "😎" }, // Will be updated with real XP
];

interface LeaderboardProps {
    currentXp: number;
}

export const Leaderboard = ({ currentXp }: LeaderboardProps) => {
    // Update "You" with real XP and sort
    const data = LEADERBOARD_DATA.map(user =>
        user.name === "You" ? { ...user, xp: currentXp } : user
    ).sort((a, b) => b.xp - a.xp);

    return (
        <Card className="bg-black/20 border-white/10 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Global Leaderboard
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {data.map((user, index) => (
                    <div
                        key={user.id}
                        className={cn(
                            "flex items-center justify-between p-3 rounded-lg border transition-all",
                            user.name === "You"
                                ? "bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                : "bg-white/5 border-white/5 hover:bg-white/10"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-8 h-8 flex items-center justify-center font-bold rounded-full",
                                index === 0 ? "text-yellow-500 bg-yellow-500/10" :
                                    index === 1 ? "text-gray-400 bg-gray-400/10" :
                                        index === 2 ? "text-amber-700 bg-amber-700/10" :
                                            "text-muted-foreground"
                            )}>
                                {index + 1}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{user.avatar}</span>
                                <span className={cn("font-medium", user.name === "You" && "text-primary")}>
                                    {user.name}
                                </span>
                            </div>
                        </div>
                        <div className="font-mono font-bold text-muted-foreground">
                            {user.xp.toLocaleString()} XP
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
