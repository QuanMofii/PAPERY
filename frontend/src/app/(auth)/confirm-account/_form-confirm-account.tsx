'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { VerifyAction } from '@/actions/auth-action';
import { cn } from '@/registry/new-york-v4/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/registry/new-york-v4/ui/form';
import { Input } from '@/registry/new-york-v4/ui/input';
import { VerifyRequest, VerifyRequestType } from '@/schemas/auth.schemas';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function ConfirmAccountForm({
    className,
    imageUrl,
    ...props
}: React.ComponentProps<'div'> & { imageUrl?: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromParams = searchParams.get('email') || '';
    const codeFromParams = searchParams.get('code') || '';

    const form = useForm<VerifyRequestType>({
        resolver: zodResolver(VerifyRequest),
        defaultValues: { email: emailFromParams, code: codeFromParams }
    });

    const onSubmit = async (data: VerifyRequestType) => {
        if (isLoading) return;
        setIsLoading(true);

        const response = await VerifyAction(data);

        toast[response.success ? 'success' : 'error'](response.success ? 'Success' : 'Error', {
            description: response.success
                ? response.data?.message || 'Account verified successfully'
                : response.error?.message,
            duration: 2000
        });

        response.success && router.push('/login');

        setIsLoading(false);
    };

    return (
        <div className={cn('flex w-4xl flex-col gap-6', className)} {...props}>
            <Card className='overflow-hidden p-0'>
                <CardContent className='grid min-h-[400px] p-0 md:grid-cols-2'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
                            <div className='flex h-full flex-col justify-center gap-6'>
                                <div className='flex flex-col items-center text-center'>
                                    <h1 className='text-2xl font-bold'>Confirm Your Account</h1>
                                    <p className='text-muted-foreground text-balance'>
                                        Enter the verification code sent to your email to activate your account.
                                    </p>
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
                                </div>
                                <Button type='submit' className='w-full' disabled={isLoading}>
                                    {isLoading ? (
                                        <span className='flex items-center gap-2'>
                                            <Loader className='h-5 w-5 animate-spin' />
                                            Verifying...
                                        </span>
                                    ) : (
                                        'Verify Account'
                                    )}
                                </Button>
                                <div className='text-center text-sm'>
                                    Didn't receive a code?{' '}
                                    <Link href='#' className='underline underline-offset-4'>
                                        Resend Code
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
                                alt='Confirm Account Image'
                                className='absolute inset-0 h-full w-full object-cover'
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
