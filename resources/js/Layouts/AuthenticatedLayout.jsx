import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    BarChart3,
    CalendarCheck,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
    X,
    User,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

export default function AuthenticatedLayout({ header, children }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const user = usePage().props.auth.user;

    // Detect mobile screen
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const mainLinks = [
        {
            title: "Dashboard",
            href: route("dashboard"),
            icon: LayoutDashboard,
            active: route().current("dashboard"),
        },
        {
            title: "Analytics",
            href: "/analytics",
            icon: BarChart3,
            active: route().current("analytics"),
        }
    ];

    const bottomLinks = [
        {
            title: "Settings",
            href: route("profile.edit"),
            icon: Settings,
            active: route().current("profile.edit"),
        },
    ];

    const NavLink = ({ link }) => {
        return (
            <Link
                href={link.href}
                className={cn(
                    "flex items-center gap-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all",
                    link.active && "text-gray-900 bg-gray-100",
                    !isMobile && "h-full"
                )}
                onClick={() => isMobile && setIsOpen(false)}
            >
                <link.icon className="w-5 h-5" />
                <span>{link.title}</span>
            </Link>
        );
    };

    const MobileNav = () => (
        <div
            className={cn(
                "fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b">
                    <div className="flex items-center">
                        <span className="text-xl font-bold">Todo App</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1 overflow-y-auto p-4">
                    <nav className="space-y-6">
                        <div className="space-y-1">
                            {mainLinks.map((link) => (
                                <NavLink key={link.title} link={link} />
                            ))}
                        </div>
                    </nav>
                </div>

                {/* Mobile Footer */}
                <div className="border-t p-4">
                    <div className="space-y-1">
                        {bottomLinks.map((link) => (
                            <NavLink key={link.title} link={link} />
                        ))}
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Log Out</span>
                        </Link>
                    </div>

                    {/* User Profile */}
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-x-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-sm font-medium">
                                    {user.name[0].toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // New TopNav component to replace the sidebar
    const TopNav = () => (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm">
            <div className="mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-x-4">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Todo App
                        </span>
                        
                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex items-center h-full ml-8 space-x-1">
                            {mainLinks.map((link) => (
                                <Link
                                    key={link.title}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-x-2 px-4 py-2 h-full text-gray-600 hover:text-primary border-b-2 border-transparent hover:border-primary transition-all",
                                        link.active && "text-primary border-primary font-medium"
                                    )}
                                >
                                    <link.icon className="w-4 h-4" />
                                    <span>{link.title}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                    
                    {/* Right Side - User Menu */}
                    <div className="flex items-center gap-x-4">
                        {/* User Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 px-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-sm font-medium">
                                            {user.name[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user.email}
                                        </p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="px-2 py-1.5 md:hidden">
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <DropdownMenuSeparator className="md:hidden" />
                                
                                {bottomLinks.map((link) => (
                                    <DropdownMenuItem key={link.title} asChild>
                                        <Link href={link.href} className="flex items-center gap-x-2 cursor-pointer">
                                            <link.icon className="w-4 h-4" />
                                            <span>{link.title}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-x-2 cursor-pointer text-red-600"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Log Out</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <TopNav />
            
            {/* Mobile Navigation Drawer */}
            {isMobile && <MobileNav />}

            {/* Main Content */}
            <div className="pt-16 transition-all duration-300">
                {header && (
                    <header className="bg-white border-b">
                        <div className="mx-auto px-4 py-6">{header}</div>
                    </header>
                )}

                <main>
                    <div className="mx-auto bg-white">{children}</div>
                </main>
            </div>
        </div>
    );
}
