"use client";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeToggle } from "./themeToggle";
import { LogOutIcon, Terminal, User } from "lucide-react";
import { AuthPopup } from "./authPopup";
import useUser from "../../store/user.store";
import Link from "next/link";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/problems", label: "Problems" },
  { href: "/playground", label: "Playground" },
];

export function Navbar() {
  const { token, setToken } = useUser();

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink
                        href={link.href}
                        className="py-1.5"
                        // active={link.active}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <div className="flex gap-1">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <Terminal size={20} />
              </div>
              <a
                href="/"
                className="text-primary text-lg hover:text-primary/90"
              >
                DevX
              </a>
            </div>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      // active={link.active}
                      href={link.href}
                      className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {!token ? (
            <AuthPopup>
              <Button asChild size="sm" className="text-sm">
                <a href="#">Get Started</a>
              </Button>
            </AuthPopup>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-sm">
                <Link href={"/profile"} className="flex items-center gap-2">
                  <User size={20} />
                  Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                title="Logout"
                onClick={handleLogout}
              >
                <LogOutIcon />
              </Button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
