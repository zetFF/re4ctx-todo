import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Calendar } from "@/Components/ui/calendar";
import { Badge } from "@/Components/ui/badge";
import {
    format,
    isToday,
    isTomorrow,
    isThisWeek,
    parseISO,
    isAfter,
    addDays,
} from "date-fns";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import {
    Clock,
    Calendar as CalendarIcon,
    CheckCircle2,
    AlertCircle,
    Tag,
    MoreVertical,
    Filter,
    Search,
    PlusCircle,
    Star,
    ArrowRight,
    ChevronRight,
    ListTodo,
    LayoutDashboard,
    X,
} from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Progress } from "@/Components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { router } from "@inertiajs/react";

export default function Upcoming({
    auth,
    upcomingTasks,
    categories,
    weekSummary,
    todaysCount,
}) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [isSearching, setIsSearching] = useState(false);

    // Function to handle tab changes
    const handleTabChange = (value) => {
        setActiveTab(value);
    };

    // Function to handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setIsSearching(e.target.value.length > 0);
    };

    // Function to handle task completion
    const handleCompleteTask = (taskId) => {
        router.post(
            route("tasks.complete", taskId),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: You can show a toast notification here
                },
            }
        );
    };

    // Function to handle date selection in calendar
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setActiveTab("all"); // Reset to all tab when a date is selected
        // Filter tasks for the selected date
        const formattedDate = format(date, "yyyy-MM-dd");
        const tasksForDate = upcomingTasks.filter((task) => {
            return task.due_date.startsWith(formattedDate);
        });

        // If there are tasks for this date, we could highlight them
        // This is just visual feedback, the actual filtering is done in the filteredTasks useMemo
    };

    // Filter tasks based on search query, active tab, and selected date
    const filteredTasks = useMemo(() => {
        return upcomingTasks.filter((task) => {
            // Search filtering
            const matchesSearch = searchQuery
                ? task.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                  task.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                : true;

            if (!matchesSearch) return false;

            const taskDate = parseISO(task.due_date);

            // Tab filtering
            switch (activeTab) {
                case "today":
                    return isToday(taskDate);
                case "tomorrow":
                    return isTomorrow(taskDate);
                case "this-week":
                    return (
                        isThisWeek(taskDate) &&
                        !isToday(taskDate) &&
                        !isTomorrow(taskDate)
                    );
                case "upcoming":
                    return isAfter(taskDate, addDays(new Date(), 7));
                default:
                    // If we're on "all" tab but have a selected date from calendar
                    if (selectedDate && !isToday(selectedDate)) {
                        return (
                            format(taskDate, "yyyy-MM-dd") ===
                            format(selectedDate, "yyyy-MM-dd")
                        );
                    }
                    return true;
            }
        });
    }, [upcomingTasks, searchQuery, activeTab, selectedDate]);

    // Group tasks by date
    const tasksByDate = useMemo(() => {
        return filteredTasks.reduce((acc, task) => {
            const date = format(new Date(task.due_date), "yyyy-MM-dd");
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(task);
            return acc;
        }, {});
    }, [filteredTasks]);

    // Calculate priority counts
    const priorityCounts = useMemo(() => {
        return upcomingTasks.reduce((counts, task) => {
            counts[task.priority] = (counts[task.priority] || 0) + 1;
            return counts;
        }, {});
    }, [upcomingTasks]);

    // Highlight dates with tasks in calendar
    const datesWithTasks = useMemo(() => {
        return upcomingTasks.map((task) => new Date(task.due_date));
    }, [upcomingTasks]);

    // Date formatter helper
    const formatDueDate = (dateStr) => {
        const date = new Date(dateStr);
        if (isToday(date)) return "Today";
        if (isTomorrow(date)) return "Tomorrow";
        return format(date, "EEEE, MMMM d, yyyy");
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Upcoming Tasks" />

            <div className="p-5">
                <div className=" mx-auto">
                    <div className="mx-auto">
                        {/* Header Section with Background */}
                        <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 p-6 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-50">
                                <div className="absolute right-0 top-0 h-40 w-40 transform translate-x-8 -translate-y-8 rounded-full bg-blue-100 blur-3xl"></div>
                                <div className="absolute left-20 bottom-0 h-40 w-40 transform -translate-y-6 rounded-full bg-indigo-100 blur-3xl"></div>
                            </div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                                            <LayoutDashboard className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                                            Upcoming Tasks
                                        </h2>
                                    </div>
                                    <p className="text-slate-600 max-w-xl">
                                        Plan your week ahead with a clear
                                        overview of all upcoming tasks and
                                        deadlines. Stay organized and never miss
                                        an important deadline.
                                    </p>
                                </div>
                                <div className="hidden md:flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        className="bg-white shadow-sm"
                                    >
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filter
                                    </Button>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        New Task
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none shadow-sm hover:shadow-md transition-all duration-300">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between">
                                        <div className="rounded-full bg-purple-500/10 p-2">
                                            <CheckCircle2 className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <Badge className="bg-purple-500 hover:bg-purple-600">
                                            This Week
                                        </Badge>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-3xl font-bold text-purple-700">
                                            {weekSummary?.total ||
                                                upcomingTasks.length}
                                        </p>
                                        <p className="text-sm text-purple-600">
                                            Total Tasks
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs mb-1 text-purple-700">
                                            <span>Progress</span>
                                            <span>
                                                {weekSummary?.completed || 0}/
                                                {weekSummary?.total ||
                                                    upcomingTasks.length}
                                            </span>
                                        </div>
                                        <Progress
                                            value={
                                                ((weekSummary?.completed || 0) /
                                                    (weekSummary?.total ||
                                                        upcomingTasks.length)) *
                                                100
                                            }
                                            className="h-2 bg-purple-200"
                                            indicatorClassName="bg-purple-600"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow-sm hover:shadow-md transition-all duration-300">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between">
                                        <div className="rounded-full bg-blue-500/10 p-2">
                                            <AlertCircle className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <Badge className="bg-blue-500 hover:bg-blue-600">
                                            Priority
                                        </Badge>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-3xl font-bold text-blue-700">
                                            {priorityCounts.high || 0}
                                        </p>
                                        <p className="text-sm text-blue-600">
                                            High Priority
                                        </p>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <div className="flex-1">
                                            <div className="h-1 w-full bg-blue-200 rounded-full">
                                                <div
                                                    className="h-1 bg-blue-600 rounded-full"
                                                    style={{
                                                        width: `${
                                                            ((priorityCounts.high ||
                                                                0) /
                                                                upcomingTasks.length) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-blue-600 mt-1">
                                                {Math.round(
                                                    ((priorityCounts.high ||
                                                        0) /
                                                        upcomingTasks.length) *
                                                        100
                                                )}
                                                %
                                            </p>
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-1 w-full bg-blue-200 rounded-full">
                                                <div
                                                    className="h-1 bg-blue-400 rounded-full"
                                                    style={{
                                                        width: `${
                                                            ((priorityCounts.medium ||
                                                                0) /
                                                                upcomingTasks.length) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-blue-600 mt-1">
                                                {Math.round(
                                                    ((priorityCounts.medium ||
                                                        0) /
                                                        upcomingTasks.length) *
                                                        100
                                                )}
                                                %
                                            </p>
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-1 w-full bg-blue-200 rounded-full">
                                                <div
                                                    className="h-1 bg-blue-300 rounded-full"
                                                    style={{
                                                        width: `${
                                                            ((priorityCounts.low ||
                                                                0) /
                                                                upcomingTasks.length) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-blue-600 mt-1">
                                                {Math.round(
                                                    ((priorityCounts.low || 0) /
                                                        upcomingTasks.length) *
                                                        100
                                                )}
                                                %
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-none shadow-sm hover:shadow-md transition-all duration-300">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between">
                                        <div className="rounded-full bg-amber-500/10 p-2">
                                            <Clock className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <Badge className="bg-amber-500 hover:bg-amber-600">
                                            Today
                                        </Badge>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-3xl font-bold text-amber-700">
                                            {todaysCount ||
                                                filteredTasks.filter((task) =>
                                                    isToday(
                                                        new Date(task.due_date)
                                                    )
                                                ).length}
                                        </p>
                                        <p className="text-sm text-amber-600">
                                            Due Today
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex items-center gap-2 text-xs text-amber-700">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span>
                                                {format(
                                                    new Date(),
                                                    "EEEE, MMMM d"
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-amber-700 mt-1">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                Most tasks due at 5:00 PM
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-none shadow-sm hover:shadow-md transition-all duration-300">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between">
                                        <div className="rounded-full bg-emerald-500/10 p-2">
                                            <Tag className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600">
                                            Categories
                                        </Badge>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-3xl font-bold text-emerald-700">
                                            {categories?.length || 5}
                                        </p>
                                        <p className="text-sm text-emerald-600">
                                            Active Categories
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex flex-wrap gap-1">
                                            {(
                                                categories || [
                                                    { name: "Work" },
                                                    { name: "Personal" },
                                                    { name: "Study" },
                                                ]
                                            )
                                                .slice(0, 3)
                                                .map((category, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="bg-emerald-100 text-emerald-700 border-emerald-200"
                                                    >
                                                        {category.name}
                                                    </Badge>
                                                ))}
                                            {(categories || []).length > 3 && (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-emerald-100 text-emerald-700 border-emerald-200"
                                                >
                                                    +
                                                    {(categories || []).length -
                                                        3}{" "}
                                                    more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Calendar Card - Now with interaction */}
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Calendar View
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Select a date to see tasks
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={handleDateSelect}
                                        className="rounded-md border shadow-sm"
                                        modifiers={{
                                            withTasks: datesWithTasks,
                                        }}
                                        modifiersStyles={{
                                            withTasks: {
                                                backgroundColor:
                                                    "rgba(59, 130, 246, 0.1)",
                                                borderRadius: "50%",
                                            },
                                        }}
                                    />

                                    {/* Tasks on selected date counter */}
                                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                                        <h3 className="font-medium text-sm mb-2">
                                            {format(
                                                selectedDate,
                                                "MMMM d, yyyy"
                                            )}
                                        </h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">
                                                {tasksByDate[
                                                    format(
                                                        selectedDate,
                                                        "yyyy-MM-dd"
                                                    )
                                                ]?.length || 0}{" "}
                                                tasks
                                            </span>
                                            {tasksByDate[
                                                format(
                                                    selectedDate,
                                                    "yyyy-MM-dd"
                                                )
                                            ]?.length > 0 && (
                                                <Button
                                                    variant="link"
                                                    className="text-xs p-0 h-auto"
                                                    onClick={() =>
                                                        setActiveTab("all")
                                                    }
                                                >
                                                    View All
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-2">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <CardTitle className="text-xl">
                                            Task List
                                        </CardTitle>

                                        {/* Working Search */}
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search tasks..."
                                                value={searchQuery}
                                                onChange={handleSearch}
                                                className="pl-8 w-full md:w-[260px]"
                                            />
                                            {isSearching && (
                                                <Button
                                                    variant="ghost"
                                                    className="absolute right-1 top-1.5 h-6 w-6 p-0 text-muted-foreground"
                                                    onClick={() => {
                                                        setSearchQuery("");
                                                        setIsSearching(false);
                                                    }}
                                                >
                                                    <span className="sr-only">
                                                        Clear
                                                    </span>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <Tabs
                                            defaultValue={activeTab}
                                            value={activeTab}
                                            onValueChange={handleTabChange}
                                        >
                                            <TabsList className="w-full max-w-full justify-start border-b bg-transparent p-0">
                                                <TabsTrigger
                                                    value="all"
                                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
                                                >
                                                    All
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="today"
                                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
                                                >
                                                    Today
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="tomorrow"
                                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
                                                >
                                                    Tomorrow
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="this-week"
                                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
                                                >
                                                    This Week
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="upcoming"
                                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
                                                >
                                                    Later
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="space-y-6">
                                        {Object.entries(tasksByDate).length >
                                        0 ? (
                                            Object.entries(tasksByDate)
                                                .sort(
                                                    ([dateA], [dateB]) =>
                                                        new Date(dateA) -
                                                        new Date(dateB)
                                                )
                                                .map(([date, tasks]) => (
                                                    <div
                                                        key={date}
                                                        className="space-y-3"
                                                    >
                                                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                                                            <CalendarIcon className="h-5 w-5 text-primary" />
                                                            <h3 className="font-medium text-slate-700">
                                                                {formatDueDate(
                                                                    date
                                                                )}
                                                            </h3>
                                                            <Badge
                                                                className="ml-auto"
                                                                variant="outline"
                                                            >
                                                                {tasks.length}{" "}
                                                                tasks
                                                            </Badge>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {tasks.map(
                                                                (task) => (
                                                                    <div
                                                                        key={
                                                                            task.id
                                                                        }
                                                                        className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm hover:bg-slate-50 transition-colors"
                                                                    >
                                                                        <div className="space-y-1 flex-1">
                                                                            <div
                                                                                className={`p-1 rounded-full ${
                                                                                    task.priority ===
                                                                                    "high"
                                                                                        ? "bg-red-100"
                                                                                        : task.priority ===
                                                                                          "medium"
                                                                                        ? "bg-amber-100"
                                                                                        : "bg-green-100"
                                                                                }`}
                                                                            >
                                                                                <Star
                                                                                    className={`h-3 w-3 ${
                                                                                        task.priority ===
                                                                                        "high"
                                                                                            ? "text-red-500"
                                                                                            : task.priority ===
                                                                                              "medium"
                                                                                            ? "text-amber-500"
                                                                                            : "text-green-500"
                                                                                    }`}
                                                                                />
                                                                            </div>
                                                                            <span className="font-medium">
                                                                                {
                                                                                    task.title
                                                                                }
                                                                            </span>
                                                                            <Badge
                                                                                variant={
                                                                                    task.priority ===
                                                                                    "high"
                                                                                        ? "destructive"
                                                                                        : task.priority ===
                                                                                          "medium"
                                                                                        ? "warning"
                                                                                        : "success"
                                                                                }
                                                                                className="capitalize text-xs"
                                                                            >
                                                                                {
                                                                                    task.priority
                                                                                }
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="h-8"
                                                                                onClick={() =>
                                                                                    handleCompleteTask(
                                                                                        task.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                                            </Button>
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger
                                                                                    asChild
                                                                                >
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="h-8 px-2"
                                                                                    >
                                                                                        <MoreVertical className="h-4 w-4" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem
                                                                                        onClick={() =>
                                                                                            router.visit(
                                                                                                route(
                                                                                                    "tasks.show",
                                                                                                    task.id
                                                                                                )
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        View
                                                                                        Details
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem
                                                                                        onClick={() =>
                                                                                            router.visit(
                                                                                                route(
                                                                                                    "tasks.edit",
                                                                                                    task.id
                                                                                                )
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Edit
                                                                                        Task
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem
                                                                                        className="text-red-600"
                                                                                        onClick={() => {
                                                                                            if (
                                                                                                confirm(
                                                                                                    "Are you sure you want to delete this task?"
                                                                                                )
                                                                                            ) {
                                                                                                router.delete(
                                                                                                    route(
                                                                                                        "tasks.destroy",
                                                                                                        task.id
                                                                                                    ),
                                                                                                    {
                                                                                                        preserveScroll: true,
                                                                                                    }
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        Delete
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                                    <CheckCircle2 className="h-8 w-8 text-blue-500" />
                                                </div>
                                                <h3 className="text-lg font-medium mb-2">
                                                    No tasks found
                                                </h3>
                                                <p className="text-muted-foreground max-w-md">
                                                    {searchQuery
                                                        ? "No tasks match your search criteria. Try using different keywords."
                                                        : "You're all caught up! There are no tasks scheduled for this period."}
                                                </p>
                                                <Button
                                                    className="mt-6"
                                                    onClick={() =>
                                                        router.visit(
                                                            route(
                                                                "tasks.create"
                                                            )
                                                        )
                                                    }
                                                >
                                                    <PlusCircle className="h-4 w-4 mr-2" />
                                                    Create New Task
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
