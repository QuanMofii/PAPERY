'use client';

import { NavUser } from '@/components/nav-user';
import { useUser } from '@/context/UserContext';
import { SidebarFooter } from '@/registry/new-york-v4/ui/sidebar';

export function DashboardSidebarFooter() {
    const { user } = useUser();
    console.log('user', user);

    if (!user) return null;

    const userInfo = {
        name: user.name,
        email: user.email,
        avatar: user.profile_image_url
    };

    return (
        <SidebarFooter>
            <NavUser user={userInfo} />
        </SidebarFooter>
    );
}
