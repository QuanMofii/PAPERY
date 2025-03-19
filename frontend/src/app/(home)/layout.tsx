import NavigationBar from '@/components/navigation-bar/navigation-bar';

const HomeLayout = (props: { children: React.ReactNode }) => {
    return (
        <>
            <NavigationBar />
            {props.children}
        </>
    );
};

export default HomeLayout;
