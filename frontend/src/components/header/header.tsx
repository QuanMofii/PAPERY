"use server";

// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/header/language-switcher";
import { Link } from "@/libs/next-intl/routing";
import MenuSetting from "@/components/header/menu-setting";
import Navigation from "@/components/header/navigation";

export async function Header() {
  console.log("Header rendered");
  return (
    <header className="w-full bg-white shadow-md z-50 fixed">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        {/* Logo and Company Name */}
        <div className="flex items-center">

          <Link href="/" className="ml-3 text-lg font-semibold text-gray-800 hover:text-blue-600">
            Company Name
          </Link>
        </div>

        {/* Navigation */}
        <div className="">
         <Navigation />
        </div>
        <div className="flex items-center space-x-2 ">
          {/* Menu Setting */}
          <MenuSetting />
          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export default Header;
