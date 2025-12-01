import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TopicProgress {
    topicId: string;
    score: number;
    completedAt: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string; // Lucide icon name or path
    unlockedAt?: string;
}

interface ProgressState {
    xp: number;
    level: number;
    streak: number;
    lastLoginDate: string;
    completedTopics: TopicProgress[];
    achievements: Achievement[];

    // Actions
    addXp: (amount: number) => void;
    completeTopic: (topicId: string, score: number) => void;
    unlockAchievement: (achievementId: string) => void;
    checkStreak: () => void;
}

export const useProgressStore = create<ProgressState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            streak: 1,
            lastLoginDate: new Date().toISOString().split('T')[0],
            completedTopics: [],
            achievements: [
                { id: 'first_win', title: 'First Victory', description: 'Complete your first lesson', icon: 'Trophy' },
                { id: 'math_whiz', title: 'Math Whiz', description: 'Score 100% on a Math quiz', icon: 'Calculator' },
                { id: 'science_pro', title: 'Science Pro', description: 'Complete 3 Science topics', icon: 'Beaker' },
                { id: 'streak_master', title: 'Streak Master', description: 'Reach a 7-day streak', icon: 'Flame' },
            ],

            addXp: (amount) => set((state) => {
                const newXp = state.xp + amount;
                const newLevel = Math.floor(newXp / 1000) + 1; // Level up every 1000 XP
                return { xp: newXp, level: newLevel };
            }),

            completeTopic: (topicId, score) => set((state) => {
                const existing = state.completedTopics.find(t => t.topicId === topicId);
                if (existing && existing.score >= score) return state; // Don't overwrite with lower score

                const newTopic = { topicId, score, completedAt: new Date().toISOString() };
                const updatedTopics = existing
                    ? state.completedTopics.map(t => t.topicId === topicId ? newTopic : t)
                    : [...state.completedTopics, newTopic];

                return { completedTopics: updatedTopics };
            }),

            unlockAchievement: (achievementId) => set((state) => {
                const achievement = state.achievements.find(a => a.id === achievementId);
                if (!achievement || achievement.unlockedAt) return state;

                const updatedAchievements = state.achievements.map(a =>
                    a.id === achievementId ? { ...a, unlockedAt: new Date().toISOString() } : a
                );
                return { achievements: updatedAchievements };
            }),

            checkStreak: () => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                if (state.lastLoginDate === today) return state;

                const lastLogin = new Date(state.lastLoginDate);
                const diffTime = Math.abs(new Date(today).getTime() - lastLogin.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    return { streak: state.streak + 1, lastLoginDate: today };
                } else if (diffDays > 1) {
                    return { streak: 1, lastLoginDate: today };
                }
                return { lastLoginDate: today };
            }),
        }),
        {
            name: 'global-student-progress',
        }
    )
);
