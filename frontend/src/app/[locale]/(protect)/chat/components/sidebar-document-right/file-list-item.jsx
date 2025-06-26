import { EllipsisVertical } from 'lucide-react';

export function FileItem({ file }) {
    return (
        <div
            className={`file relative flex h-full w-full items-center justify-between rounded-lg p-2 ${file.type === 'pdf' ? 'bg-orange-400' : 'bg-blue-500'}`}>
            <div className={`flex h-16 w-6 items-center space-x-2 p-2`}>
                <div className={`translate-x-[-50%] -rotate-90 font-semibold text-white uppercase`}>{file.type}</div>
            </div>
            <div
                className={`absolute right-0 z-50 flex h-full w-[90%] justify-between gap-1 rounded-lg bg-yellow-400 px-2`}>
                <div className='flex flex-col justify-center'>
                    <p className='text-sm font-medium text-stone-700'>{file.name}</p>
                    <p className='text-xs text-gray-500'>{file.size}</p>
                </div>
                <div className={`inset-0 transition-opacity duration-200`}>
                    <div className='flex h-full w-full cursor-pointer items-center justify-center border-none text-stone-500'>
                        <EllipsisVertical className='h-5 w-5' />
                    </div>
                </div>
            </div>
        </div>
    );
}
