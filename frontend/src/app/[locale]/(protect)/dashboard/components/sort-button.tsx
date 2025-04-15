'use client';

import { Button } from '@/registry/new-york-v4/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/registry/new-york-v4/ui/dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';
import { useListProjectStore } from '@/store/project-list.store';

type SortOption = 'name' | 'created' | 'updated';

export function SortButton() {
    const { sortBy, setSortBy } = useListProjectStore();

    const handleSort = (option: SortOption) => {
        console.log('Sorting by:', option);
        setSortBy(option);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sắp xếp theo:</span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="items-center gap-1">
                        <div className="flex flex-row items-center">
                            {sortBy === 'name' ? 'Tên' : sortBy === 'created' ? 'Ngày tạo' : 'Ngày cập nhật'}
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSort('name')}>
                        Tên
                        {sortBy === 'name' && <Check className="ml-2 h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('created')}>
                        Ngày tạo
                        {sortBy === 'created' && <Check className="ml-2 h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('updated')}>
                        Ngày cập nhật
                        {sortBy === 'updated' && <Check className="ml-2 h-4 w-4" />}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
