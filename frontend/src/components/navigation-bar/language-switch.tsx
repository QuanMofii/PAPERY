'use client';

import { Button } from '@/registry/new-york-v4/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/new-york-v4/ui/popover';

import { Languages } from 'lucide-react';

const LANGUAGES = [
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'en', label: 'English' }
];

export const LanguageSwitch = () => {
    const currentLang = 'vi';

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                    <Languages className='h-4 w-4' />
                    <span className='sr-only'>Toggle language</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-32' align='end'>
                <div className='flex flex-col gap-1'>
                    {LANGUAGES.map((lang) => (
                        <Button
                            key={lang.code}
                            variant='ghost'
                            size='sm'
                            className='justify-start'
                            onClick={() => {
                                console.log(`Switching to ${lang.code}`);
                            }}>
                            <span className={currentLang === lang.code ? 'font-medium' : ''}>{lang.label}</span>
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};
