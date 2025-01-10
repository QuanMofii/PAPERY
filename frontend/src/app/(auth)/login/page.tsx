import SuspendedLoginForm from '@/app/(auth)/login/_form-login';
import { createTranslation } from '@/libs/i18n/i18n';
// import { getTranslations } from 'next-intl/server';

const LoginPage = async () => {
    // const t = await getTranslations();
    const {t} = await createTranslation('login');
    console.log(t);
    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <div className="h-full w-full flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">{t.page.title}</h1>
                <div className="text-left bg-white p-6 rounded-lg shadow-md  mx-auto">
                    <SuspendedLoginForm t = {t}/>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
