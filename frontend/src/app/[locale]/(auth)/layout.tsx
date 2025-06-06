const GroupAuthLayout = (props: { children: React.ReactNode }) => {
    return (
        <main className='mx-auto flex min-h-screen items-center justify-center gap-6 p-3 font-[family-name:var(--font-geist-sans)] sm:gap-12'>
            {props.children}
        </main>
    );
};

export default GroupAuthLayout;
