'use server';

import Link from 'next/link';
import { GuideDialogContent } from '@/components/guide-dialog';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Dialog, DialogTrigger } from '@/registry/new-york-v4/ui/dialog';
import { BookOpen, FileText } from 'lucide-react';
import { ProjectList } from './components/project-list';
import { CreateProjectCard } from './components/create-project';
import { SortButton } from './components/sort-button';

export default async function DashboardPage() {
    return (
        <div className='flex max-h-screen h-screen gap-6 pt-16 pb-4 '>
            {/* Main Content */}
            <div className='flex max-h-full flex-1 flex-col'>
                <div className='border-border/40 rounded-xl border bg-white p-6 shadow-sm'>
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div >
                            <h1 className='text-primary text-2xl font-bold'>Chào mừng đến với Papery!</h1>
                            <p className='text-muted-foreground hidden sm:block line-clamp-1'>
                                Nền tảng AI giúp bạn quản lý và tương tác với tài liệu một cách thông minh
                            </p>
                        </div>
                        <div className='flex gap-2  sm:flex-col lg:hidden flex-row'>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant='outline' size='sm' className='flex items-center gap-1'>
                                        <div className='flex flex-row items-center'>
                                            <BookOpen className='mr-1 h-4 w-4' />
                                            <p>Hướng dẫn</p>
                                        </div>
                                    </Button>
                                </DialogTrigger>
                                <GuideDialogContent />
                            </Dialog>
                            <Link href='/documents'>
                                <Button variant='outline' size='sm' className='flex items-center gap-1' asChild>
                                    <div className='flex flex-row items-center'>
                                        <FileText className='mr-1 h-4 w-4' />
                                        <p>Bảng tài liệu</p>
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white border border-border/40 p-6 shadow-sm flex flex-col flex-1 overflow-hidden mt-3">
                    <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Dự án của bạn</h2>
                        </div>
                        <SortButton />
                    </div>

                    <div className="flex-1 overflow-auto pb-4 scrollbar-thin ">
                        <div className="grid gap-4 xl:grid-cols-3 sm:grid-cols-2 ">
                            <CreateProjectCard />
                            <ProjectList />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub Content - Hidden on mobile */}
            <div className='hidden max-h-full w-96 flex-col space-y-3 lg:flex'>
                <div className='border-border/40 flex max-h-full flex-1 flex-col overflow-hidden rounded-xl border bg-white p-6 shadow-sm'>
                    <div className='flex flex-col'>
                        <h2 className='text-foreground text-lg font-semibold'>Hướng dẫn sử dụng</h2>
                        <p className='text-muted-foreground text-sm'>Các bước để bắt đầu với Papery</p>
                    </div>

                    <div className='mt-6 flex-1 overflow-y-auto'>
                        <div className='h-full space-y-6'>
                            <div className='space-y-2'>
                                <h3 className='flex items-center gap-2 font-medium'>
                                    <span className='bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold'>
                                        1
                                    </span>
                                    <span>Bước 1: Tạo dự án</span>
                                </h3>
                                <p className='text-muted-foreground line-clamp-2 overflow-hidden pl-8 text-sm'>
                                    Tạo không gian làm việc riêng cho từng dự án, quản lý chat và tài liệu riêng biệt.
                                </p>
                            </div>

                            <div className='space-y-2'>
                                <h3 className='flex items-center gap-2 font-medium'>
                                    <span className='bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold'>
                                        2
                                    </span>
                                    <span>Bước 2: Tải lên tài liệu</span>
                                </h3>
                                <p className='text-muted-foreground line-clamp-2 overflow-hidden pl-8 text-sm'>
                                    Hỗ trợ đa định dạng, xử lý đa ngôn ngữ và giữ nguyên cấu trúc tài liệu gốc.
                                </p>
                            </div>

                            <div className='space-y-2'>
                                <h3 className='flex items-center gap-2 font-medium'>
                                    <span className='bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold'>
                                        3
                                    </span>
                                    <span>Bước 3: Chat với tài liệu</span>
                                </h3>
                                <p className='text-muted-foreground line-clamp-2 overflow-hidden pl-8 text-sm'>
                                    Tương tác thông minh với tài liệu qua AI: đặt câu hỏi, tóm tắt và phân tích nội
                                    dung.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='mt-6'>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className='w-full' variant='outline' size='sm'>
                                    Đọc thêm
                                </Button>
                            </DialogTrigger>
                            <GuideDialogContent />
                        </Dialog>
                    </div>
                </div>

                <div className='border-border/40 rounded-xl border bg-white p-6 shadow-sm'>
                    <Button variant='ghost' className='group h-auto w-full p-0' asChild>
                        <Link href='/documents'>
                            <div className='flex w-full items-center justify-between transition-all duration-300 group-hover:translate-x-1'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-primary/10 group-hover:bg-primary/20 rounded-full p-3 transition-all duration-300'>
                                        <FileText className='text-primary h-6 w-6' />
                                    </div>
                                    <span className='text-lg font-medium'>Xem toàn bộ tài liệu</span>
                                </div>
                                <div className='bg-primary/5 group-hover:bg-primary/10 flex items-center rounded-full p-2 transition-all duration-300 group-hover:translate-x-1'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='24'
                                        height='24'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        className='text-primary h-5 w-5'>
                                        <path d='M5 12h14' />
                                        <path d='m12 5 7 7-7 7' />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
