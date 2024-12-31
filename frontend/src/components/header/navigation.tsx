"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex items-center space-x-2">
      {/* Home Button */}
      <Link href="/" passHref>
        <Button
          variant={isActive("/") ? "default" : "ghost"}
          className={isActive("/") ? "bg-blue-500 text-white" : ""}
        >
          Home
        </Button>
      </Link>

      {/* Dashboard Button */}
      <Link href="/dashboard" passHref>
        <Button
          variant={isActive("/dashboard") ? "default" : "ghost"}
          className={isActive("/dashboard") ? "bg-blue-500 text-white" : ""}
        >
          Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default Navigation;
