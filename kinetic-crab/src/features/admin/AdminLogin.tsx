import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Lock, ShieldCheck } from 'lucide-react';

const adminLoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export const AdminLogin = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    // Use state to expose internal details if needed, for now using direct login

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<AdminLoginForm>({
        resolver: zodResolver(adminLoginSchema),
    });

    const onSubmit = async (data: AdminLoginForm) => {
        try {
            // Developer Bypass
            if (data.email === 'admin@global.com' && data.password === 'admin123') {
                useAuthStore.getState().loginAsDevAdmin();
                navigate('/admin/dashboard');
                return;
            }

            await login(data.email, data.password);
            
            // Re-check user from store after login sets it
            const user = useAuthStore.getState().user;
            if (user?.role !== 'admin') {
               throw new Error('Access Denied: Not an admin account');
            }
            navigate('/admin/dashboard');
        } catch (error: any) {
            setError('root', {
                message: error.message || 'Invalid Email or Password'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <Card className="w-full max-w-md border-slate-700 bg-slate-900/50 backdrop-blur-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-6 h-6 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Admin Portal</CardTitle>
                    <CardDescription>Restricted access for curriculum managers</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Admin Email"
                            icon={<ShieldCheck className="w-4 h-4" />}
                            placeholder="admin@global.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />
                        <Input
                            label="Password"
                            type="password"
                            icon={<Lock className="w-4 h-4" />}
                            placeholder="Enter your password"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        {errors.root && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {errors.root.message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                            isLoading={isSubmitting}
                        >
                            Access Dashboard
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-xs text-muted-foreground">
                        Unauthorized access is prohibited.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};
