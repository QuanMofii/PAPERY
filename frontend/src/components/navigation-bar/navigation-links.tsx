'use client';

import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/registry/new-york-v4/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';

const NAVIGATION_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/examples', label: 'Examples' },

];

interface NavigationLinksProps {
    className?: string;
}

const NavigationLinks = ({ className }: NavigationLinksProps) => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <nav className={cn('flex gap-1', className)}>
            {NAVIGATION_LINKS.map((link) => {
                const isActive = link.href === '/' ? pathname === link.href : pathname.startsWith(link.href);

                return (
                    <Button
                        key={link.href}
                        variant='ghost'
                        size='lg'
                        className={cn('w-full font-medium transition-colors', isActive && 'bg-muted hover:bg-muted')}
                        onClick={() => router.push(link.href)}>
                        {link.label}
                    </Button>
                );
            })}
        </nav>
    );
};

export default NavigationLinks;
