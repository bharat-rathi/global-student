import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginData } from '../../lib/validation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const StudentLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [loginError, setLoginError] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginData) => {
        setLoginError(null);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock login success
        if (data.username.toLowerCase() === 'student' && data.password === 'Password123') {
            login({
                id: '1',
                username: data.username,
                role: 'student',
                firstName: 'Student',
                lastName: 'User',
            });
            navigate('/dashboard');
        } else {
            setLoginError('Invalid username or password');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl">Welcome Back!</CardTitle>
                    <CardDescription>
                        Ready to continue your learning journey?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                label="Username"
                                placeholder="Enter your username"
                                icon={<User className="w-4 h-4" />}
                                error={errors.username?.message}
                                {...register('username')}
                            />
                            <div className="space-y-2">
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="Enter your password"
                                    icon={<Lock className="w-4 h-4" />}
                                    error={errors.password?.message}
                                    {...register('password')}
                                />
                                <div className="flex justify-end">
                                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                                {...register('rememberMe')}
                            />
                            <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
                                Remember me
                            </label>
                        </div>

                        {loginError && (
                            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                {loginError}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full text-lg h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                            isLoading={isSubmitting}
                        >
                            Log In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:underline font-medium">
                            Sign up
                        </Link>
                    </p>
                    <div className="text-xs text-muted-foreground bg-white/5 p-2 rounded border border-white/10">
                        <p>Demo Credentials:</p>
                        <p>User: student</p>
                        <p>Pass: Password123</p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};
