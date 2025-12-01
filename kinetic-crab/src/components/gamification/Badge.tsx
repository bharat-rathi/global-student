import React from 'react';
import { cn } from '../../lib/utils';
import { Trophy, Calculator, Beaker, Flame, Lock } from 'lucide-react';

// Map icon strings to Lucide components
const ICON_MAP: Record<string, any> = {
    Trophy,
    Calculator,
    Beaker,
    Flame
};

interface BadgeProps {
    title: string;
    description: string;
    icon: string;
    isUnlocked?: boolean;
    className?: string;
}

export const Badge = ({ title, description, icon, isUnlocked = false, className }: BadgeProps) => {
    const IconComponent = ICON_MAP[icon] || Trophy;

    return (
        <div className={cn(
            "relative group flex flex-col items-center p-4 rounded-xl border transition-all duration-300",
            isUnlocked
                ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/50 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20"
                : "bg-white/5 border-white/10 opacity-60 grayscale",
            className
        )}>
            <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all",
                isUnlocked ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg" : "bg-white/10 text-white/20"
            )}>
                {isUnlocked ? <IconComponent className="w-8 h-8" /> : <Lock className="w-6 h-6" />}
            </div>

            <h3 className={cn("font-bold text-center text-sm", isUnlocked ? "text-white" : "text-muted-foreground")}>
                {title}
            </h3>

            {/* Tooltip */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 text-center z-10">
                <p className="text-xs font-medium text-white">{description}</p>
            </div>
        </div>
    );
};
