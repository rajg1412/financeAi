'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardFooter, CardDescription, CardTitle } from '@/components/ui/card';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            // Optionally trigger welcome email via Inngest here or via webhook
            router.push('/login?message=Check your email to confirm your account');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your email below to create your account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </Button>
                    <div className="text-sm text-center text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
