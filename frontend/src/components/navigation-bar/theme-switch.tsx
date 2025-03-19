// 'use client';

// import * as React from 'react';

// import { useTheme } from 'next-themes';

// import { Button } from '@/registry/new-york-v4/ui/button';
// import { Popover, PopoverContent, PopoverTrigger } from '@/registry/new-york-v4/ui/popover';

// import { Moon, Sun } from 'lucide-react';

// export function ThemeSwitch() {
//     const { setTheme } = useTheme();

//     return (
//         <Popover>
//             <PopoverTrigger asChild>
//                 <Button variant='ghost' size='icon' className='relative'>
//                     <Sun className='h-4 w-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90' />
//                     <Moon className='absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0' />
//                     <span className='sr-only'>Toggle theme</span>
//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className='w-28' align='end'>
//                 <div className='flex flex-col gap-1'>
//                     <Button variant='ghost' size='sm' className='justify-start' onClick={() => setTheme('light')}>
//                         Light
//                     </Button>
//                     <Button variant='ghost' size='sm' className='justify-start' onClick={() => setTheme('dark')}>
//                         Dark
//                     </Button>
//                     <Button variant='ghost' size='sm' className='justify-start' onClick={() => setTheme('system')}>
//                         System
//                     </Button>
//                 </div>
//             </PopoverContent>
//         </Popover>
//     );
// }
