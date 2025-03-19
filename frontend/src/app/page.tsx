import HomeLayout from './(home)/layout';
import HomePage from './(home)/page';

/**
 * The main page component that renders the HomePage component.
 *
 * @returns {JSX.Element} The rendered HomePage component.
 */
const Page = () => {
    return (
        <HomeLayout>
            <HomePage />
        </HomeLayout>
    );
};

export default Page;
