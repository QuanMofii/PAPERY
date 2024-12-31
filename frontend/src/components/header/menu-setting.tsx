"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

const MenuSetting = () => {
  const { user, setUser } = useUser();

  const handleSignOut = () => {
    // Xử lý đăng xuất
    setUser(null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user ? (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-8 h-8 rounded-full cursor-pointer"
          />
        ) : (
          <Button variant="outline" className="text-gray-800 hover:text-blue-600">
            Setting
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-40">
        {user ? (
          <>
            <DropdownMenuItem>Welcome, {user.name}</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              Sign Out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/login">Sign In</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/register">Sign Up</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuSetting;
