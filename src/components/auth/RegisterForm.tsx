import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

type PasswordStrength = 'weak' | 'medium' | 'strong';

const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return 'weak';

    let strength = 0;

    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Complexity checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
};

export function RegisterForm() {
    const navigate = useNavigate();
    const register_action = useAuthStore((state) => state.register);
    const isLoading = useAuthStore((state) => state.isLoading);
    const error = useAuthStore((state) => state.error);
    const clearError = useAuthStore((state) => state.clearError);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        defaultValues: {
            acceptTerms: false,
        },
    });

    const passwordValue = watch('password', '');
    const passwordStrength = calculatePasswordStrength(passwordValue);

    const onSubmit = async (data: RegisterFormData) => {
        clearError();

        try {
            await register_action(data.username, data.email, data.password);
            // Navigate to dashboard on success
            navigate('/dashboard');
        } catch (error) {
            // Error is handled in the store
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md">
                <div className="bg-card rounded-3xl shadow-2xl p-8 border border-border">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Join LearnQuest
                        </h1>
                        <p className="text-muted-foreground">
                            Start your learning journey today
                        </p>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                            <p className="text-sm text-destructive font-medium">{error}</p>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-bold text-foreground ml-1">
                                Username
                            </label>
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    size={18}
                                />
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="johndoe"
                                    className={`w-full pl-10 pr-4 py-3 bg-secondary/20 border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${errors.username ? 'border-destructive' : 'border-border'
                                        }`}
                                    {...register('username', {
                                        required: 'Username is required',
                                        minLength: {
                                            value: 3,
                                            message: 'Username must be at least 3 characters',
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9_]+$/,
                                            message: 'Username can only contain letters, numbers, and underscores',
                                        },
                                    })}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-sm text-destructive ml-1">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-bold text-foreground ml-1">
                                Email
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    size={18}
                                />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className={`w-full pl-10 pr-4 py-3 bg-secondary/20 border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${errors.email ? 'border-destructive' : 'border-border'
                                        }`}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-destructive ml-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-bold text-foreground ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    size={18}
                                />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-12 py-3 bg-secondary/20 border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${errors.password ? 'border-destructive' : 'border-border'
                                        }`}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters',
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {passwordValue && (
                                <div className="space-y-1">
                                    <div className="flex gap-1">
                                        <div
                                            className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength === 'weak'
                                                    ? 'bg-red-500'
                                                    : passwordStrength === 'medium'
                                                        ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                                }`}
                                        />
                                        <div
                                            className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength === 'medium' || passwordStrength === 'strong'
                                                    ? passwordStrength === 'medium'
                                                        ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                                    : 'bg-secondary'
                                                }`}
                                        />
                                        <div
                                            className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-secondary'
                                                }`}
                                        />
                                    </div>
                                    <p
                                        className={`text-xs ml-1 font-medium ${passwordStrength === 'weak'
                                                ? 'text-red-500'
                                                : passwordStrength === 'medium'
                                                    ? 'text-yellow-500'
                                                    : 'text-green-500'
                                            }`}
                                    >
                                        Password strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                                    </p>
                                </div>
                            )}

                            {errors.password && (
                                <p className="text-sm text-destructive ml-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-bold text-foreground ml-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    size={18}
                                />
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-12 py-3 bg-secondary/20 border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${errors.confirmPassword ? 'border-destructive' : 'border-border'
                                        }`}
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (value) =>
                                            value === passwordValue || 'Passwords do not match',
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive ml-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Terms Acceptance */}
                        <div className="flex items-start gap-2 pt-2">
                            <input
                                id="acceptTerms"
                                type="checkbox"
                                className={`w-4 h-4 mt-0.5 rounded border-border text-accent focus:ring-accent focus:ring-2 ${errors.acceptTerms ? 'border-destructive' : ''
                                    }`}
                                {...register('acceptTerms', {
                                    required: 'You must accept the terms and conditions',
                                })}
                            />
                            <label htmlFor="acceptTerms" className="text-sm text-muted-foreground">
                                I agree to the{' '}
                                <Link to="/terms" className="text-accent hover:underline font-medium">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-accent hover:underline font-medium">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                        {errors.acceptTerms && (
                            <p className="text-sm text-destructive ml-1 -mt-2">{errors.acceptTerms.message}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link to="/login" className="font-bold text-accent hover:underline">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
