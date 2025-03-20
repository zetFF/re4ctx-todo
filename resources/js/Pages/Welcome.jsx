import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/Components/ui/navigation-menu";
import {
    CheckCircle2,
    ArrowRight,
    Star,
    Zap,
    Shield,
    Users,
    BarChart,
    Calendar,
    Clock,
    Layout,
    Settings,
    Bell,
    Twitter,
    Github,
    Linkedin,
    Instagram,
    ArrowUp,
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Welcome({ auth }) {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    const staggerContainer = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                href="/"
                                className="text-xl font-bold text-primary"
                            >
                                RE4CTX
                            </Link>
                        </div>

                        {/* Navigation Menu */}
                        <NavigationMenu className="hidden md:block">
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>
                                        Features
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px]">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Link
                                                    href="#"
                                                    className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <BarChart className="w-5 h-5 text-primary" />
                                                    <div>
                                                        <h3 className="font-medium">
                                                            Analytics
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            Track your
                                                            productivity
                                                        </p>
                                                    </div>
                                                </Link>
                                                <Link
                                                    href="#"
                                                    className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Calendar className="w-5 h-5 text-primary" />
                                                    <div>
                                                        <h3 className="font-medium">
                                                            Calendar View
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            Visualize your
                                                            schedule
                                                        </p>
                                                    </div>
                                                </Link>
                                                <Link
                                                    href="#"
                                                    className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Bell className="w-5 h-5 text-primary" />
                                                    <div>
                                                        <h3 className="font-medium">
                                                            Reminders
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            Never miss deadlines
                                                        </p>
                                                    </div>
                                                </Link>
                                                <Link
                                                    href="#"
                                                    className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Settings className="w-5 h-5 text-primary" />
                                                    <div>
                                                        <h3 className="font-medium">
                                                            Customization
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            Personalize your
                                                            workflow
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link
                                        href="#pricing"
                                        className="px-4 py-2 text-sm"
                                    >
                                        Pricing
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link
                                        href="#about"
                                        className="px-4 py-2 text-sm"
                                    >
                                        About
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-4">
                            <Link href={route("login")}>
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href={route("register")}>
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <motion.div
                className="relative pt-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent"></div>

                <motion.div
                    className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    <motion.div
                        className="text-center space-y-8 max-w-3xl mx-auto"
                        variants={fadeIn}
                    >
                        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Organize Your Work & Life with
                            <span className="text-primary block mt-2">
                                RE4CTX Todo
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The intelligent task management platform that helps
                            you achieve more. Stay organized, focused, and in
                            control of your day.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Button size="lg" className="rounded-full px-8">
                                Start for Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full px-8"
                            >
                                Watch Demo
                            </Button>
                        </div>
                        <div className="pt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Free Forever Plan
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                No Credit Card
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Cancel Anytime
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
                className="py-24 bg-white"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center max-w-2xl mx-auto mb-16"
                        variants={fadeIn}
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to be productive
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Powerful features designed to boost your
                            productivity and streamline your workflow.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[
                            {
                                icon: <Layout className="h-6 w-6" />,
                                title: "Intuitive Interface",
                                description:
                                    "Clean and modern interface that makes task management a breeze.",
                            },
                            {
                                icon: <Calendar className="h-6 w-6" />,
                                title: "Smart Scheduling",
                                description:
                                    "Intelligent task scheduling that adapts to your working style.",
                            },
                            {
                                icon: <Bell className="h-6 w-6" />,
                                title: "Smart Reminders",
                                description:
                                    "Never miss important deadlines with customizable notifications.",
                            },
                            {
                                icon: <Users className="h-6 w-6" />,
                                title: "Team Collaboration",
                                description:
                                    "Work seamlessly with your team members on shared projects.",
                            },
                            {
                                icon: <BarChart className="h-6 w-6" />,
                                title: "Progress Tracking",
                                description:
                                    "Visual insights into your productivity and task completion.",
                            },
                            {
                                icon: <Shield className="h-6 w-6" />,
                                title: "Data Security",
                                description:
                                    "Enterprise-grade security to protect your sensitive information.",
                            },
                        ].map((feature, index) => (
                            <motion.div key={index} variants={fadeIn}>
                                <Card className="border-none shadow-md hover:shadow-lg transition-all">
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                                            {feature.icon}
                                        </div>
                                        <CardTitle>{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                className="py-20 bg-gray-50"
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { number: "20K+", label: "Active Users" },
                            { number: "1M+", label: "Tasks Completed" },
                            { number: "99.9%", label: "Uptime" },
                            { number: "24/7", label: "Support" },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Pricing Section */}
            <motion.div
                className="py-24 bg-white"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
            >
                <motion.div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                    variants={fadeIn}
                >
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Choose the perfect plan for you
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Start with our free plan or upgrade for more
                            features
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Free",
                                price: "$0",
                                description: "Perfect for getting started",
                                features: [
                                    "Up to 10 projects",
                                    "Basic task management",
                                    "Calendar view",
                                    "Mobile app access",
                                ],
                                buttonText: "Get Started",
                                popular: false,
                            },
                            {
                                name: "Pro",
                                price: "$9",
                                description: "Best for professionals",
                                features: [
                                    "Unlimited projects",
                                    "Advanced task management",
                                    "Team collaboration",
                                    "Priority support",
                                    "Custom templates",
                                    "Advanced analytics",
                                ],
                                buttonText: "Start Pro Trial",
                                popular: true,
                            },
                            {
                                name: "Enterprise",
                                price: "$29",
                                description: "For large teams",
                                features: [
                                    "Everything in Pro",
                                    "Enterprise SSO",
                                    "Advanced security",
                                    "Custom integration",
                                    "Dedicated support",
                                    "SLA guarantee",
                                ],
                                buttonText: "Contact Sales",
                                popular: false,
                            },
                        ].map((plan, index) => (
                            <Card
                                key={index}
                                className={cn(
                                    "relative border-2",
                                    plan.popular
                                        ? "border-primary shadow-lg scale-105"
                                        : "border-gray-200"
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-primary text-white text-sm py-1 text-center">
                                        Most Popular
                                    </div>
                                )}
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl">
                                        {plan.name}
                                    </CardTitle>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">
                                            {plan.price}
                                        </span>
                                        <span className="text-gray-600">
                                            /month
                                        </span>
                                    </div>
                                    <CardDescription className="mt-2">
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center"
                                            >
                                                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                                                <span className="text-gray-600">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        className={cn(
                                            "w-full mt-8",
                                            plan.popular
                                                ? "bg-primary"
                                                : "bg-gray-900"
                                        )}
                                    >
                                        {plan.buttonText}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* Testimonials Section */}
            <motion.div
                className="py-24 bg-gray-50"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Loved by productive teams
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            See what our users have to say about RE4CTX
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                content:
                                    "RE4CTX has transformed how our team manages tasks. The interface is intuitive and the features are exactly what we needed.",
                                author: "Sarah Johnson",
                                role: "Product Manager at TechCorp",
                                image: "https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg",
                            },
                            {
                                content:
                                    "The best task management tool we've used. It's helped us increase productivity by 40% in just two months.",
                                author: "Michael Chen",
                                role: "Engineering Lead at StartupX",
                                image: "https://randomuser.me/api/portraits/men/32.jpg",
                            },
                            {
                                content:
                                    "Finally, a todo app that actually helps you get things done! The reminders and priority system are game-changers.",
                                author: "Emily Davis",
                                role: "Freelance Designer",
                                image: "https://randomuser.me/api/portraits/women/44.jpg",
                            },
                        ].map((testimonial, index) => (
                            <motion.div key={index} variants={fadeIn}>
                                <Card className="bg-white">
                                    <CardContent className="p-6">
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 mb-6">
                                            "{testimonial.content}"
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.author}
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {testimonial.author}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {testimonial.role}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
                className="py-24 bg-white"
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Frequently asked questions
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Everything you need to know about RE4CTX
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <Accordion
                            type="single"
                            collapsible
                            className="space-y-4"
                        >
                            {[
                                {
                                    question: "How does the free plan work?",
                                    answer: "Our free plan includes all the basic features you need to get started with task management. You can create up to 10 projects and invite 2 team members.",
                                },
                                {
                                    question:
                                        "Can I upgrade or downgrade my plan anytime?",
                                    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
                                },
                                {
                                    question:
                                        "Is there a mobile app available?",
                                    answer: "Yes, we offer mobile apps for both iOS and Android platforms. You can download them from the respective app stores.",
                                },
                                {
                                    question:
                                        "What kind of support do you offer?",
                                    answer: "We offer 24/7 email support for all plans. Pro and Enterprise plans also get priority support and dedicated account managers.",
                                },
                            ].map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                >
                                    <AccordionTrigger className="text-left">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
                className="relative py-24 overflow-hidden"
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
            >
                <div className="absolute inset-0 "></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Ready to transform your productivity?
                    </h2>
                    <p className="mt-4 text-lg text-primary max-w-2xl mx-auto">
                        Join thousands of users who are already experiencing the
                        power of organized task management.
                    </p>
                    <div className="mt-10">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="rounded-full px-8"
                        >
                            Get Started Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Footer Section */}
            <motion.footer
                className="bg-primary text-gray-300"
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
            >
                {/* Main Footer with Pattern */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {/* Company Info */}
                            <div className="space-y-6">
                                <Link
                                    href="/"
                                    className="inline-flex items-center space-x-2"
                                >
                                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                        <span className="text-xl font-bold text-primary">
                                            R
                                        </span>
                                    </div>
                                    <span className="text-2xl font-bold text-white">
                                        RE4CTX
                                    </span>
                                </Link>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Modern task management platform helping
                                    teams and individuals stay organized and
                                    productive.
                                </p>
                                <div className="flex items-center gap-4">
                                    {[
                                        {
                                            icon: (
                                                <Twitter className="h-5 w-5" />
                                            ),
                                            href: "#",
                                        },
                                        {
                                            icon: (
                                                <Github className="h-5 w-5" />
                                            ),
                                            href: "#",
                                        },
                                        {
                                            icon: (
                                                <Linkedin className="h-5 w-5" />
                                            ),
                                            href: "#",
                                        },
                                        {
                                            icon: (
                                                <Instagram className="h-5 w-5" />
                                            ),
                                            href: "#",
                                        },
                                    ].map((social, index) => (
                                        <Link
                                            key={index}
                                            href={social.href}
                                            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {social.icon}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-6">
                                    Product
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "Features",
                                        "Integrations",
                                        "Pricing",
                                        "Changelog",
                                        "Documentation",
                                        "Download Apps",
                                        "Security",
                                    ].map((item) => (
                                        <li key={item}>
                                            <Link
                                                href="#"
                                                className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center group"
                                            >
                                                <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Company Links */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-6">
                                    Company
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "About Us",
                                        "Careers",
                                        "Blog",
                                        "Press",
                                        "Partners",
                                        "Terms of Service",
                                        "Privacy Policy",
                                    ].map((item) => (
                                        <li key={item}>
                                            <Link
                                                href="#"
                                                className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center group"
                                            >
                                                <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Newsletter */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-6">
                                    Stay Updated
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    Get the latest updates about new features
                                    and product announcements.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="flex-1 bg-gray-800/50 backdrop-blur-sm text-white px-4 py-2 text-sm rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary border border-gray-700"
                                        />
                                        <Button className="rounded-l-none bg-primary hover:bg-primary/90">
                                            Subscribe
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        By subscribing, you agree to our Privacy
                                        Policy and consent to receive updates.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-800/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="text-sm text-gray-400">
                                © {new Date().getFullYear()} RE4CTX. All rights
                                reserved.
                            </div>
                            <div className="mt-4 md:mt-0">
                                <div className="flex items-center space-x-6">
                                    {[
                                        "Terms",
                                        "Privacy",
                                        "Cookies",
                                        "Contact",
                                    ].map((item) => (
                                        <Link
                                            key={item}
                                            href="#"
                                            className="text-sm text-gray-400 hover:text-white transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to Top Button */}
                <button
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="fixed bottom-8 right-8 bg-primary/90 backdrop-blur-sm text-white p-2 rounded-full shadow-lg hover:bg-primary transition-colors"
                >
                    <ArrowUp className="h-6 w-6" />
                </button>
            </motion.footer>
        </div>
    );
}
