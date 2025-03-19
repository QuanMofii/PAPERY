'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/registry/new-york-v4/ui/button';

export function GetStartedButton() {
    const router = useRouter();

    return (
        <Button
            variant='default'
            size='lg'
            className='bg-foreground text-background hover:bg-foreground/90'
            onClick={() => router.push('/register')}>
            GET STARTED !
        </Button>
    );
}
