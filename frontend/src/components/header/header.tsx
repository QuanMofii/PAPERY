import LanguageSwitcher from '@/components/header/language-switcher';

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        {/* Logo */}
        <div className="flex items-center">
          {/* <img
            src="/logo.png" 
            alt="Logo"
            className="h-8 w-auto"
          /> */}
          <span className="ml-2 text-lg font-semibold text-gray-800">
            Company Name
          </span>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export default Header;