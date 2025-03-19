'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ModeSwitcher } from '@/components/mode-switcher';
import { GetStartedButton } from '@/components/navigation-bar/get-started-button';
import { LanguageSwitch } from '@/components/navigation-bar/language-switch';
import NavigationLinks from '@/components/navigation-bar/navigation-links';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/registry/new-york-v4/ui/sheet';

import { Menu, X } from 'lucide-react';

const NavigationBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-0 z-50 w-full border-b backdrop-blur'>
            <div className='mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4'>
                <div className='flex w-full items-center gap-4'>
                    {/* Mobile Menu Button - Left Side */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant='ghost' size='icon' className='lg:hidden'>
                                {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side='left' className='w-64 px-1 pt-8'>
                            <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
                            <div className='mt-6 flex flex-col gap-6'>
                                <NavigationLinks className='flex-col items-stretch' />
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Logo */}
                    <Link href='/' className='flex items-center gap-2'>
                        <div className='relative h-8 w-8'>
                            <Image src='/images/logo.png' alt='Logo' fill className='object-contain' priority />
                        </div>
                        <span className='hidden text-xl font-bold sm:inline-block'>Next.js</span>
                    </Link>
                </div>

                {/* Navigation Links - Center */}
                <div className='absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform lg:block'>
                    <NavigationLinks className='items-center' />
                </div>

                {/* Right Side Actions */}
                <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-2'>
                        <LanguageSwitch />

                        <ModeSwitcher />
                    </div>
                    <GetStartedButton />
                </div>
            </div>
        </div>
    );
};

export default NavigationBar;
