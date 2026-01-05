import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
    id: string;
    username: string;
    role: 'student' | 'parent' | 'admin';
    firstName: string;
    lastName: string;
    email?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginAsDevAdmin: () => void;
    loginAsDemoStudent: () => void;
    register: (email: string, password: string, metadata: any) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        if (data.user) {
            // Fetch profile data
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            const user: User = {
                id: data.user.id,
                email: data.user.email,
                username: profile?.username || data.user.user_metadata.username,
                role: profile?.role || 'student',
                firstName: profile?.first_name || data.user.user_metadata.firstName,
                lastName: profile?.last_name || data.user.user_metadata.lastName,
            };
            set({ user, isAuthenticated: true });
        }
    },

    loginAsDevAdmin: () => {
        const user: User = {
            id: 'dev-admin-id',
            email: 'admin@global.com',
            username: 'DevAdmin',
            role: 'admin',
            firstName: 'Developer',
            lastName: 'Admin',
        };
        set({ user, isAuthenticated: true });
    },

    loginAsDemoStudent: () => {
        const user: User = {
            id: 'demo-student-id',
            email: 'demo@student.com',
            username: 'DemoStudent',
            role: 'student',
            firstName: 'Demo',
            lastName: 'Student',
        };
        set({ user, isAuthenticated: true });
    },

    register: async (email, password, metadata) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: metadata }
        });
        if (error) throw error;
        
        if (data.user) {
             const user: User = {
                id: data.user.id,
                email: data.user.email,
                username: metadata.username,
                role: 'student',
                firstName: metadata.firstName,
                lastName: metadata.lastName,
            };
            set({ user, isAuthenticated: true });
        }
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
    },

    checkSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

             const user: User = {
                id: session.user.id,
                email: session.user.email,
                username: profile?.username || session.user.user_metadata.username,
                role: profile?.role || 'student',
                firstName: profile?.first_name || session.user.user_metadata.firstName,
                lastName: profile?.last_name || session.user.user_metadata.lastName,
            };
            set({ user, isAuthenticated: true });
        }
    }
}));
