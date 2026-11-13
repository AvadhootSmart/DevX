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
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/problems", label: "Problems" },
  { href: "/playground", label: "Playground" },
];

export function Navbar() {
  const { token, setToken, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  const handleLogout = () => {
    router.push("/");
    setToken(null);
  };

  return (
    <header className="border-b border-border px-4 md:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
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
                        active={isActive(link.href)}
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
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md text-lg font-semibold text-primary outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <span className="bg-primary text-primary-foreground p-1 rounded-md">
                <Terminal size={18} aria-hidden="true" />
              </span>
              DevX
            </Link>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      active={isActive(link.href)}
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
          {!token && !user ? (
            <AuthPopup>
              <Button size="sm">Get Started</Button>
            </AuthPopup>
          ) : (
            <div className="flex gap-1">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(isActive("/profile") && "bg-accent")}
              >
                <Link href="/profile">
                  <User aria-hidden="true" />
                  Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                title="Log out"
                aria-label="Log out"
                onClick={handleLogout}
              >
                <LogOutIcon aria-hidden="true" />
              </Button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
