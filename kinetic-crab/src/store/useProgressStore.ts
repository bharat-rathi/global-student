import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface TopicProgress {
    topicId: string;
    score: number;
    completedAt: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
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
    fetchProgress: () => Promise<void>;
    addXp: (amount: number) => Promise<void>;
    completeTopic: (topicId: string, score: number) => Promise<void>;
    unlockAchievement: (achievementId: string) => Promise<void>;
    checkStreak: () => Promise<void>;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
    { id: 'first_win', title: 'First Victory', description: 'Complete your first lesson', icon: 'Trophy' },
    { id: 'math_whiz', title: 'Math Whiz', description: 'Score 100% on a Math quiz', icon: 'Calculator' },
    { id: 'science_pro', title: 'Science Pro', description: 'Complete 3 Science topics', icon: 'Beaker' },
    { id: 'streak_master', title: 'Streak Master', description: 'Reach a 7-day streak', icon: 'Flame' },
];

export const useProgressStore = create<ProgressState>((set, get) => ({
    xp: 0,
    level: 1,
    streak: 1,
    lastLoginDate: new Date().toISOString().split('T')[0],
    completedTopics: [],
    achievements: DEFAULT_ACHIEVEMENTS,

    fetchProgress: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch Profile Data
        const { data: profile } = await supabase
            .from('profiles')
            .select('xp, level, streak, last_login_date')
            .eq('id', user.id)
            .single();

        // Fetch Completed Topics
        const { data: topics } = await supabase
            .from('user_progress')
            .select('topic_id, score, completed_at')
            .eq('user_id', user.id);

        // Fetch Achievements
        const { data: unlocked } = await supabase
            .from('user_achievements')
            .select('achievement_id, unlocked_at')
            .eq('user_id', user.id);

        if (profile) {
            set({
                xp: profile.xp,
                level: profile.level,
                streak: profile.streak,
                lastLoginDate: profile.last_login_date,
            });
        }

        if (topics) {
            set({
                completedTopics: topics.map((t: any) => ({
                    topicId: t.topic_id,
                    score: t.score,
                    completedAt: t.completed_at
                }))
            });
        }

        if (unlocked) {
            set(state => ({
                achievements: state.achievements.map(a => {
                    const unlockData = unlocked.find((u: any) => u.achievement_id === a.id);
                    return unlockData ? { ...a, unlockedAt: unlockData.unlocked_at } : a;
                })
            }));
        }
    },

    addXp: async (amount) => {
        const state = get();
        const newXp = state.xp + amount;
        const newLevel = Math.floor(newXp / 1000) + 1;

        set({ xp: newXp, level: newLevel });

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase
                .from('profiles')
                .update({ xp: newXp, level: newLevel })
                .eq('id', user.id);
        }
    },

    completeTopic: async (topicId, score) => {
        const state = get();
        const existing = state.completedTopics.find(t => t.topicId === topicId);
        
        // Optimistic update
        const newTopic = { topicId, score, completedAt: new Date().toISOString() };
        if (existing && existing.score >= score) return;

        const updatedTopics = existing
            ? state.completedTopics.map(t => t.topicId === topicId ? newTopic : t)
            : [...state.completedTopics, newTopic];
        
        set({ completedTopics: updatedTopics });

        // DB Update
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase
                .from('user_progress')
                .upsert({ 
                    user_id: user.id,
                    topic_id: topicId, 
                    score, 
                    completed_at: newTopic.completedAt 
                }, { onConflict: 'user_id, topic_id' });
        }
    },

    unlockAchievement: async (achievementId) => {
        const state = get();
        const achievement = state.achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlockedAt) return;

        // Optimistic
        const now = new Date().toISOString();
        const updatedAchievements = state.achievements.map(a =>
            a.id === achievementId ? { ...a, unlockedAt: now } : a
        );
        set({ achievements: updatedAchievements });

        // DB Update
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase
                .from('user_achievements')
                .upsert({ 
                    user_id: user.id,
                    achievement_id: achievementId, 
                    unlocked_at: now 
                }, { onConflict: 'user_id, achievement_id' });
        }
    },

    checkStreak: async () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        if (state.lastLoginDate === today) return;

        const lastLogin = new Date(state.lastLoginDate);
        const diffTime = Math.abs(new Date(today).getTime() - lastLogin.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let newStreak = state.streak;
        if (diffDays === 1) {
            newStreak += 1;
        } else if (diffDays > 1) {
            newStreak = 1;
        }

        set({ streak: newStreak, lastLoginDate: today });

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase
                .from('profiles')
                .update({ streak: newStreak, last_login_date: today })
                .eq('id', user.id);
        }
    },
}));
