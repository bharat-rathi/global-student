import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { passwordSchema } from '../../lib/validation';

const parentSetupSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type ParentSetupData = z.infer<typeof parentSetupSchema>;

export const ParentVerify = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const studentName = searchParams.get('student') || 'your child';
    const { login } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ParentSetupData>({
        resolver: zodResolver(parentSetupSchema),
    });

    const onSubmit = async (data: ParentSetupData) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Auto-login parent
        login({
            id: 'parent-1',
            username: 'parent@example.com',
            role: 'parent',
            firstName: 'Parent',
            lastName: 'User',
        });

        navigate('/parent/dashboard');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-primary/50 shadow-primary/20">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8 text-green-500" />
                    </div>
                    <CardTitle className="text-3xl">Activate Parent Account</CardTitle>
                    <CardDescription className="text-lg mt-2">
                        Link account for <span className="font-semibold text-primary">{studentName}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10 text-sm text-muted-foreground">
                        <p>By activating this account, you consent to {studentName} using Global Student. You will have full control over their settings and progress.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Set Your Password"
                            type="password"
                            placeholder="••••••••"
                            icon={<Lock className="w-4 h-4" />}
                            error={errors.password?.message}
                            {...register('password')}
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            icon={<Lock className="w-4 h-4" />}
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        <Button
                            type="submit"
                            className="w-full text-lg h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-600/90 hover:to-teal-600/90"
                            isLoading={isSubmitting}
                        >
                            Activate & Link Account
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
