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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";

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
        },
        {
            title: "Upcoming",
            href: "/upcoming",
            icon: CalendarCheck,
            active: route().current("upcoming"),
        },
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
                    link.active && "text-gray-900 bg-gray-100"
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

    const DesktopNav = () => (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200">
            {/* Desktop sidebar content */}
            <div className="flex h-full flex-col">
                <div className="h-16 flex items-center px-4 border-b">
                    <span className="text-xl font-bold">Todo App</span>
                </div>

                <div className="flex-1 flex flex-col gap-y-4 p-4">
                    <nav className="space-y-1">
                        {mainLinks.map((link) => (
                            <NavLink key={link.title} link={link} />
                        ))}
                    </nav>
                </div>

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

                    <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
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
        </aside>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Show different navigation based on screen size */}
            {isMobile ? (
                <>
                    <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b">
                        <div className="h-16 flex items-center px-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                            <span className="ml-4 text-xl font-bold">
                                Todo App
                            </span>
                        </div>
                    </div>
                    <MobileNav />
                </>
            ) : (
                <DesktopNav />
            )}

            {/* Main Content */}
            <div
                className={cn(
                    "transition-all duration-300",
                    isMobile ? "pt-16" : "ml-64"
                )}
            >
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
