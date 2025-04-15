'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/registry/new-york-v4/ui/card';
import { Skeleton } from '@/registry/new-york-v4/ui/skeleton';

export function ProjectSkeleton() {
    return (
        <Card className="max-h-[188px] h-[188px] pb-2 border-none w-full">
            <CardHeader className=" ">
                <Skeleton className="h-4 w-full bg-accent/30" />

            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-15 bg-accent/30" />
                <Skeleton className="h-4 w-1/2 bg-accent/30" />
            </CardContent>

        </Card>
    );
}
