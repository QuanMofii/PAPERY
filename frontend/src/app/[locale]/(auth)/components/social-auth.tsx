'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { SocialAuthAction } from '@/actions/auth-action';
import { Button } from '@/registry/new-york-v4/ui/button';

import { Apple, Facebook, Github, Loader } from 'lucide-react';
import { toast } from 'sonner';

const providers = [
    { name: 'apple', url: 'apple', icon: <Apple fill='currentColor' strokeWidth={3} /> },
    {
        name: 'facebook',
        url: 'facebook',
        icon: <Facebook fill='currentColor' strokeWidth={2.25} />
    },
    { name: 'github', url: 'github', icon: <Github fill='currentColor' strokeWidth={3} /> }
];

export function SocialAuth() {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleSocialLogin = async (provider: string) => {
        if (isLoading) return;
        setIsLoading(provider);

        const response = await SocialAuthAction(provider);

        toast[response.success ? 'success' : 'error'](response.success ? 'Success' : 'Error', {
            description: response.success ? response.data?.message : response.error?.message,
            duration: 2000
        });

        response.success && router.push('/dashboard');

        setIsLoading(null);
    };

    return (
        <>
            {/* Social login buttons */}
            <div className='grid grid-cols-3 gap-4'>
                {providers.map((provider) => (
                    <Button
                        key={provider.name}
                        variant='outline'
                        type='button'
                        className='flex w-full items-center justify-center gap-2'
                        disabled={isLoading === provider.url}
                        onClick={() => handleSocialLogin(provider.url)}>
                        {isLoading === provider.url ? <Loader className='h-5 w-5 animate-spin' /> : provider.icon}
                        <span className='sr-only'>Login with {provider.name}</span>
                    </Button>
                ))}
            </div>
        </>
    );
}
