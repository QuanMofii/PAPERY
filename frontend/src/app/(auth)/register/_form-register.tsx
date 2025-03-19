'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { RegisterAction } from '@/actions/auth-action';
import { SocialAuth } from '@/components/auth/social-auth';
import { cn } from '@/registry/new-york-v4/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/registry/new-york-v4/ui/form';
import { Input } from '@/registry/new-york-v4/ui/input';
import { RegisterRequest, RegisterRequestType } from '@/schemas/auth.schemas';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function RegisterForm({ className, imageUrl, ...props }: React.ComponentProps<'div'> & { imageUrl?: string }) {
    console.log('1');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<RegisterRequestType>({
        resolver: zodResolver(RegisterRequest),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmpassword: ''
        }
    });

    const onSubmit = async (data: RegisterRequestType) => {
        if (isLoading) return;
        setIsLoading(true);

        const response = await RegisterAction(data);

        toast[response.success ? 'success' : 'error'](response.success ? 'Success' : 'Error', {
            description: response.success ? response.data?.message || 'Register successfully' : response.error?.message,
            duration: 2000
        });

        response.success && router.push('/login');

        setIsLoading(false);
    };

    return (
        <div className={cn('h-4xl flex w-4xl flex-col gap-6', className)} {...props}>
            <Card className='overflow-hidden p-0'>
                <CardContent className='grid p-0 md:grid-cols-2'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
                            <div className='flex flex-col gap-6'>
                                <div className='flex flex-col items-center text-center'>
                                    <h1 className='text-2xl font-bold'>Create an Account.</h1>
                                    <p className='text-muted-foreground text-balance'>Sign up to get started</p>
                                </div>

                                <div className='grid gap-3'>
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='Enter your name' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='grid gap-3'>
                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='Enter your email' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='grid gap-3'>
                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type='password' placeholder='Enter password' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='grid gap-3'>
                                    <FormField
                                        control={form.control}
                                        name='confirmpassword'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input type='password' placeholder='Confirm password' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type='submit'
                                    className='flex w-full flex-row items-center justify-center'
                                    disabled={isLoading}>
                                    {isLoading ? (
                                        <span className='flex items-center gap-2'>
                                            <Loader className='h-5 w-5 animate-spin' />
                                            Signing up...
                                        </span>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </Button>
                                <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                                    <span className='bg-background text-muted-foreground relative z-10 px-2'>
                                        Or continue with
                                    </span>
                                </div>
                                <SocialAuth />
                                <div className='text-center text-sm'>
                                    Already have an account?{' '}
                                    <Link href='/login' className='underline underline-offset-4'>
                                        Log in
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>

                    <div className='bg-primary/50 relative hidden md:block'>
                        {imageUrl && (
                            <Image
                                fill
                                src={imageUrl}
                                alt='Register Image'
                                className='absolute inset-0 h-full w-full object-cover'
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
            <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
                By signing up, you agree to our <Link href='#'>Terms of Service</Link> and{' '}
                <Link href='#'>Privacy Policy</Link>.
            </div>
        </div>
    );
}
