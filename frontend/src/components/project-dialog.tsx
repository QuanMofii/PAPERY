import { Button } from '@/registry/new-york-v4/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/registry/new-york-v4/ui/dialog';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';

interface ProjectDialogContentProps {
    title: string;
    description: string;
    defaultValues?: {
        name: string;
        description: string;
    };
    onSubmit: (data: { name: string; description: string }) => void;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    isLoading?: boolean;
}

export const ProjectDialogContent = ({
    title,
    description,
    defaultValues,
    onSubmit,
    isOpen,
    onOpenChange,
    isLoading = false
}: ProjectDialogContentProps) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit({
            name: formData.get('name') as string,
            description: formData.get('description') as string
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[95vh] max-w-2xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='name'>Tên dự án</Label>
                        <Input
                            id='name'
                            name='name'
                            placeholder='Nhập tên dự án'
                            defaultValue={defaultValues?.name}
                            required
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='description'>Mô tả</Label>
                        <Textarea
                            id='description'
                            name='description'
                            placeholder='Nhập mô tả dự án'
                            defaultValue={defaultValues?.description}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type='submit' disabled={isLoading}>
                            {isLoading ? 'Đang xử lý...' : defaultValues ? 'Cập nhật' : 'Tạo dự án'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
