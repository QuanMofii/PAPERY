import * as React from 'react';

import { cn } from '@/registry/new-york-v4/lib/utils';
import { Slot } from '@radix-ui/react-slot';

import { type VariantProps, cva } from 'class-variance-authority';

const buttonVariants = cva(
    "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-in-out active:scale-98 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/80',
                destructive:
                    'bg-destructive text-white shadow-xs hover:bg-destructive/80 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
                outline: 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
                secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline'
            },
            size: {
                default: 'h-9 px-4 py-2 has-[>svg]:px-3',
                sm: 'h-8 rounded-md px-3 has-[>svg]:px-2.5',
                lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
                icon: 'size-9'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    children,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp data-slot='button' className={cn(buttonVariants({ variant, size, className }))} {...props}>
            {/* Giữ hiệu ứng thu nhỏ khi click nhưng không đổi màu */}
            <span className='transition-transform duration-150 ease-out'>{children}</span>
        </Comp>
    );
}

export { Button, buttonVariants };
