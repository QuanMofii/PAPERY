'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { HttpError, http } from '@/lib/http';
import { cn } from '@/registry/new-york-v4/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/registry/new-york-v4/ui/form';
import { Input } from '@/registry/new-york-v4/ui/input';
import { ResetRequest, ResetRequestType } from '@/schemas/auth.schemas';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function ResetPasswordForm({
    className,
    imageUrl,
    ...props
}: React.ComponentProps<'div'> & { imageUrl?: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromParams = searchParams.get('email') || '';
    const codeFromParams = searchParams.get('code') || '';

    const form = useForm<ResetRequestType>({
        resolver: zodResolver(ResetRequest),
        defaultValues: {
            email: emailFromParams,
            code: codeFromParams,
            password: '',
            confirmpassword: ''
        }
    });

    const onSubmit = async (data: ResetRequestType) => {
        if (isLoading) return;
        setIsLoading(true);
        console.log(data);
        try {
            await http.post('/reset-password', {
                email: data.email,
                code: data.code,
                password: data.password
            });

            toast.success('Success', {
                description: `Your password has been reset successfully.`,
                duration: 2000
            });

            router.push('/login');
        } catch (error: any) {
            console.log(error);
            if (error instanceof HttpError) {
                toast.error(`Error (Status: ${error.status})`, {
                    description: `${error.message}`
                });
            } else {
                toast.error(`Error`, {
                    description: `Unexpected error occurred. Please try later.`
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn('flex w-4xl flex-col gap-6', className)} {...props}>
            <Card className='overflow-hidden p-0'>
                <CardContent className='grid min-h-[500px] p-0 md:grid-cols-2'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
                            <div className='flex h-full flex-col justify-center gap-6'>
                                <div className='flex flex-col items-center text-center'>
                                    <h1 className='text-2xl font-bold'>Reset Your Password</h1>
                                    <p className='text-muted-foreground text-balance'>Enter your new password.</p>
                                </div>
                                <div className='grid gap-3'>
                                    {!emailFromParams && (
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
                                    )}
                                    {!codeFromParams && (
                                        <FormField
                                            control={form.control}
                                            name='code'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Verification Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Enter the code' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='password'
                                                        placeholder='Enter new password'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='confirmpassword'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='password'
                                                        placeholder='Confirm new password'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type='submit' className='w-full' disabled={isLoading}>
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </Button>
                                <div className='text-center text-sm'>
                                    Remember your password?{' '}
                                    <Link href='/login' className='underline underline-offset-4'>
                                        Login
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
                                alt='Reset Password Image'
                                className='absolute inset-0 h-full w-full object-cover'
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
