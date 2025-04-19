import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    PieChart,
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

    // Enhanced navigation links with categories and descriptions
    const mainLinks = [
        {
            title: "Dashboard",
            description: "Overview of your tasks",
            href: route("dashboard"),
            icon: LayoutDashboard,
            active: route().current("dashboard"),
            category: "main"
        },
        {
            title: "Analytics",
            description: "Task statistics and insights",
            href: "/analytics",
            icon: PieChart,
            active: route().current("analytics"),
            category: "main"
        }
    ];

    const bottomLinks = [
        {
            title: "Settings",
            description: "Manage your account",
            href: route("profile.edit"),
            icon: Settings,
            active: route().current("profile.edit"),
            category: "account"
        },
    ];

    // Enhanced NavLink component with hover effects and better visual hierarchy
    const NavLink = ({ link }) => {
        return (
            <Link
                href={link.href}
                className={cn(
                    "flex items-center gap-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200",
                    link.active && "text-primary bg-primary/5 font-medium",
                    !isMobile && "h-full"
                )}
                onClick={() => isMobile && setIsOpen(false)}
            >
                <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                    link.active ? "bg-primary/10 text-primary" : "text-gray-500 group-hover:text-primary"
                )}>
                    <link.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{link.title}</span>
                    {link.description && <span className="text-xs text-gray-500">{link.description}</span>}
                </div>
            </Link>
        );
    };

    // Enhanced mobile navigation with better organization
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
                    <img src="https://res.cloudinary.com/ddy7p8yrj/image/upload/v1742203820/wlltkoo3ipqb5lbbocdi.png" width={60} alt="" />
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
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                                Main Navigation
                            </h3>
                            <div className="space-y-1">
                                {mainLinks.map((link) => (
                                    <NavLink key={link.title} link={link} />
                                ))}
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Mobile Footer */}
                <div className="border-t p-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                        Account
                    </h3>
                    <div className="space-y-1">
                        {bottomLinks.map((link) => (
                            <NavLink key={link.title} link={link} />
                        ))}
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500">
                                <LogOut className="w-5 h-5" />
                            </div>
                            <span>Log Out</span>
                        </Link>
                    </div>

                    {/* User Profile */}
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
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

    // Enhanced top navigation with better visual hierarchy and animations
    const TopNav = () => (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm">
            <div className=" mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-x-4">
                       <img src="https://res.cloudinary.com/ddy7p8yrj/image/upload/v1742203820/wlltkoo3ipqb5lbbocdi.png" width={60} alt="" />
                        
                        {/* Desktop Navigation Links - Enhanced with better visual indicators */}
                        <nav className="hidden md:flex items-center h-full ml-8 space-x-1">
                            {mainLinks.map((link) => (
                                <Link
                                    key={link.title}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-x-2 px-4 py-2 h-full text-gray-600 hover:text-primary relative group",
                                        link.active && "text-primary font-medium"
                                    )}
                                >
                                    <link.icon className="w-4 h-4" />
                                    <span>{link.title}</span>
                                    
                                    {/* Active indicator with animation */}
                                    <span className={cn(
                                        "absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-all duration-300",
                                        link.active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                    )}></span>
                                    
                                    {/* Tooltip with description */}
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                        <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap mt-2">
                                            {link.description}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </nav>
                    </div>
                    
                    {/* Right Side - User Menu */}
                    <div className="flex items-center gap-x-4">
                        {/* User Dropdown - Enhanced with better styling */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-gray-100 rounded-full">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
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
                        <div className=" mx-auto">{header}</div>
                    </header>
                )}

                <main>
                    <div className=" mx-auto bg-white">{children}</div>
                </main>
            </div>
        </div>
    );
}
