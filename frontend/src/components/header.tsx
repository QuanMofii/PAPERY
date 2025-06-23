import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import { LanguageSwitcher } from '@/components/language-switcher';
import { NavUser } from '@/components/nav-user';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { cn } from '@/registry/new-york-v4/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/registry/new-york-v4/ui/dropdown-menu';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Skeleton } from '@/registry/new-york-v4/ui/skeleton';

// import { useUser } from '@/context/user-context';

import { Menu, Search } from 'lucide-react';

const DASHBOARD_LINKS = [
    { href: '/dashboard', label: 'Dashboard', segment: 'dashboard' },
    { href: '/chat', label: 'Chat', segment: 'chat' },
    { href: '/community', label: 'Community', segment: 'community' }
] as const;

export function Header() {
    const segment = useSelectedLayoutSegment();
    // const { user } = useUser();

    const renderNavLinks = () => {
        return DASHBOARD_LINKS.map((link) => {
            const isActive = link.segment === segment;

            return (
                <Link key={link.href} href={link.href} className='' aria-current={isActive ? 'page' : undefined}>
                    <Button
                        variant='ghost'
                        size='default'
                        asChild
                        className={cn(
                            'hover:bg-primary/90 font-medium transition-colors',
                            isActive && 'text-primary border-primary border-2 bg-transparent'
                        )}>
                        <span>{link.label}</span>
                    </Button>
                </Link>
            );
        });
    };

    return (
        <header className='flex h-16 flex-1 shrink-0 items-center justify-between'>
            {/* Left section */}
            <div className='flex items-center gap-4'>
                {/* Desktop Navigation */}
                <nav className='hidden items-center gap-2 md:flex' role='navigation' aria-label='Main'>
                    {renderNavLinks()}
                </nav>
                {/* Mobile Navigation */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className='md:hidden'>
                        <Button variant='ghost' size='icon'>
                            <Menu className='h-5 w-5' />
                            <span className='sr-only'>Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start' className='w-[200px]'>
                        {/* Search for mobile */}
                        <div className='px-2 py-1.5'>
                            <div className='relative'>
                                <Search className='text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform' />
                                <Input placeholder='Search...' className='w-full pl-8' />
                                <hr className='' />
                            </div>
                        </div>

                        {DASHBOARD_LINKS.map((link) => {
                            const isActive = link.segment === segment;

                            return (
                                <DropdownMenuItem key={link.href} asChild>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            'cursor-pointer',
                                            isActive && 'bg-primary text-primary-foreground'
                                        )}>
                                        {link.label}
                                    </Link>
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Right section */}
            <div className='flex items-center gap-4'>
                {/* Desktop Search */}
                <div className='relative hidden max-w-sm sm:block'>
                    <Search className='text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform' />
                    <Input placeholder='Search globally...' className='w-[200px] pl-8' />
                </div>
                <LanguageSwitcher />
                <ThemeSwitcher />
                {/* {user ? (
                    <NavUser user={{
                        name: user.name || user.username,
                        email: user.email,
                        avatar: user.profile_image_url
                    }} />
                ) : (
                    <Skeleton className="h-8 w-8 rounded-full" />
                )} */}
            </div>
        </header>
    );
}
