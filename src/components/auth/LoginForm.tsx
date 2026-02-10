import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

export function LoginForm() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);
    const error = useAuthStore((state) => state.error);
    const clearError = useAuthStore((state) => state.clearError);

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        defaultValues: {
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        clearError();

        try {
            await login(data.email, data.password);
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
                            Welcome Back!
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {/* ErrorDisplay */}
                    {error && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                            <p className="text-sm text-destructive font-medium">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                            {errors.password && (
                                <p className="text-sm text-destructive ml-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent focus:ring-2"
                                    {...register('rememberMe')}
                                />
                                <span className="text-sm text-muted-foreground">Remember me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-accent hover:underline font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
                                    Signing In...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <Link to="/register" className="font-bold text-accent hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
