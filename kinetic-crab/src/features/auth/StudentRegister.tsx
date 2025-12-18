import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentRegistrationSchema, type StudentRegistrationData } from '../../lib/validation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Calendar, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const StudentRegister = () => {
    const navigate = useNavigate();
    const { register: registerUser } = useAuthStore();
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm<StudentRegistrationData>({
        resolver: zodResolver(studentRegistrationSchema),
        defaultValues: {
            gradeLevel: '6', // Default to grade 6 as per focus
        },
    });

    const onSubmit = async (data: StudentRegistrationData) => {
        try {
            await registerUser(data.email, data.password, {
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                gradeLevel: data.gradeLevel,
                parentEmail: data.parentEmail,
                dateOfBirth: data.dateOfBirth,
                role: 'student'
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error('Registration failed:', error);
            // In a real app, handle error UI here
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-primary/50 shadow-primary/20">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-3xl">Almost There!</CardTitle>
                        <CardDescription className="text-lg mt-2">
                            We've sent a verification email to your parent.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            Ask your parent to check their email and approve your account to start playing!
                        </p>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-sm font-medium text-white">Parent Email:</p>
                            <p className="text-primary">{watch('parentEmail')}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button variant="outline" onClick={() => navigate('/login')}>
                            Return to Login
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl">Create Student Account</CardTitle>
                    <CardDescription>
                        Join the global learning adventure!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">About You</h4>
                                <Input
                                    label="First Name"
                                    placeholder="John"
                                    error={errors.firstName?.message}
                                    {...register('firstName')}
                                />
                                <Input
                                    label="Last Name"
                                    placeholder="Doe"
                                    error={errors.lastName?.message}
                                    {...register('lastName')}
                                />
                                <Input
                                    label="Date of Birth"
                                    type="date"
                                    error={errors.dateOfBirth?.message}
                                    icon={<Calendar className="w-4 h-4" />}
                                    {...register('dateOfBirth')}
                                />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-200">Grade Level</label>
                                    <div className="relative">
                                        <select
                                            className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 appearance-none"
                                            {...register('gradeLevel')}
                                        >
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i + 1} value={String(i + 1)}>
                                                    Grade {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                    {errors.gradeLevel && (
                                        <p className="text-sm font-medium text-destructive">{errors.gradeLevel.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Account Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account Details</h4>
                                <Input
                                    label="Username"
                                    placeholder="CoolStudent123"
                                    icon={<User className="w-4 h-4" />}
                                    error={errors.username?.message}
                                    {...register('username')}
                                />
                                <Input
                                    label="Student Email"
                                    type="email"
                                    placeholder="student@example.com"
                                    icon={<Mail className="w-4 h-4" />}
                                    error={errors.email?.message}
                                    {...register('email')}
                                />
                                <Input
                                    label="Password"
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
                                <Input
                                    label="Parent's Email"
                                    type="email"
                                    placeholder="parent@example.com"
                                    icon={<Mail className="w-4 h-4" />}
                                    error={errors.parentEmail?.message}
                                    {...register('parentEmail')}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                                    {...register('agreeToTerms')}
                                />
                                <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                                    I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                                </span>
                            </label>
                            {errors.agreeToTerms && (
                                <p className="text-sm font-medium text-destructive mt-1">{errors.agreeToTerms.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-lg h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                            isLoading={isSubmitting}
                        >
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};
