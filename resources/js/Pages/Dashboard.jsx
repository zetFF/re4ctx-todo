import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useState, useMemo } from "react";
import {
    Grid,
    List,
    Search,
    Bell,
    Filter,
    Plus,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Pencil,
    Trash2,
    MoreVertical,
    Folder,
    Circle,
    MoreHorizontal,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as DatePicker } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/Components/ui/label";

export default function Dashboard({ auth, todos, categories, stats }) {
    const [viewType, setViewType] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState("12:00");

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        priority: "medium",
        category_id: "",
        due_date: format(new Date(), "yyyy-MM-dd"),
        due_time: "12:00",
        reminder: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("todos.store"), {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    const handleComplete = (id) => {
        router.put(
            route("todos.complete", id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Optional: Add any success handling here
                },
            }
        );
    };

    const handleEdit = (id) => {
        // Implement your edit logic here
    };

    const handleDelete = (id) => {
        // Implement your delete logic here
    };

    const AddTaskDialog = useMemo(() => {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>
                            Create a new task with all the details.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder="Task title"
                                className="w-full"
                            />
                            {errors.title && (
                                <span className="text-sm text-red-500">
                                    {errors.title}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="Task description"
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={data.priority}
                                onValueChange={(value) =>
                                    setData("priority", value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={data.category_id}
                                onValueChange={(value) =>
                                    setData("category_id", value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !selectedDate &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDate ? (
                                            format(selectedDate, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <DatePicker
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => {
                                            setSelectedDate(date);
                                            setData(
                                                "due_date",
                                                format(date, "yyyy-MM-dd")
                                            );
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time">Due Time</Label>
                            <Input
                                id="time"
                                type="time"
                                value={selectedTime}
                                onChange={(e) => {
                                    setSelectedTime(e.target.value);
                                    setData("due_time", e.target.value);
                                }}
                                className="w-full"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Input
                                type="checkbox"
                                id="reminder"
                                checked={data.reminder}
                                onChange={(e) =>
                                    setData("reminder", e.target.checked)
                                }
                                className="w-4 h-4"
                            />
                            <Label htmlFor="reminder">Set Reminder</Label>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto"
                            >
                                {processing ? "Creating..." : "Create Task"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }, [isOpen, data, errors, processing, selectedDate, selectedTime]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="w-full">
                    {/* Stats Overview - Responsive Grid */}
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            Task Overview
                        </h2>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="relative"
                            >
                                <Bell className="w-4 h-4" />
                                {stats.pending > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                                        {stats.pending}
                                    </span>
                                )}
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Filter className="w-4 h-4 md:mr-2" />
                                        <span className="hidden md:inline">
                                            Filters
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuLabel>
                                        Filter by Status
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        All Tasks
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Pending</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>
                                        Filter by Priority
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        High Priority
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Medium Priority
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Low Priority
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Stats Cards - Responsive Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                        {/* Total Tasks Card */}
                        <Card className="col-span-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs md:text-sm font-medium">
                                    Total Tasks
                                </CardTitle>
                                <Loader2 className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg md:text-2xl font-bold">
                                    {stats.total}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    All tasks in your list
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs md:text-sm font-medium">
                                    Completed
                                </CardTitle>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg md:text-2xl font-bold text-green-500">
                                    {stats.completed}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Tasks completed
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs md:text-sm font-medium">
                                    Pending
                                </CardTitle>
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg md:text-2xl font-bold text-yellow-500">
                                    {stats.pending}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Tasks pending
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs md:text-sm font-medium">
                                    Due Today
                                </CardTitle>
                                <Calendar className="w-4 h-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg md:text-2xl font-bold text-blue-500">
                                    {
                                        todos.filter(
                                            (todo) =>
                                                new Date(
                                                    todo.due_date
                                                ).toDateString() ===
                                                new Date().toDateString()
                                        ).length
                                    }
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Tasks due today
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Controls - Responsive Stack */}
                    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                        <div className="flex flex-col md:flex-row gap-3 md:items-center flex-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="search"
                                    placeholder="Search tasks..."
                                    className="pl-10 w-full"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                            <Select>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.slug}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-3">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={
                                        viewType === "grid"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="icon"
                                    onClick={() => setViewType("grid")}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={
                                        viewType === "list"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="icon"
                                    onClick={() => setViewType("list")}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                            {AddTaskDialog}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            {/* Todo Grid/List View - Responsive */}
            <div className="p-4">
                <div className="mx-auto">
                    {viewType === "grid" ? (
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {todos.map((todo) => (
                                <Card
                                    key={todo.id}
                                    className={cn(
                                        "relative bg-white border-none shadow-sm hover:shadow-md transition-all duration-300",
                                        todo.status === "completed" &&
                                            "bg-gray-50"
                                    )}
                                >
                                    <CardContent className="p-5">
                                        {/* Title & Priority */}
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <h3
                                                className={cn(
                                                    "font-medium text-sm text-gray-900 line-clamp-1",
                                                    todo.status ===
                                                        "completed" &&
                                                        "line-through text-gray-500"
                                                )}
                                            >
                                                {todo.title}
                                            </h3>
                                            <span
                                                className={cn(
                                                    "shrink-0 w-2 h-2 mt-1.5 rounded-full",
                                                    todo.priority === "high"
                                                        ? "bg-red-500"
                                                        : todo.priority ===
                                                          "medium"
                                                        ? "bg-yellow-500"
                                                        : "bg-green-500"
                                                )}
                                            />
                                        </div>

                                        {/* Description */}
                                        <p
                                            className={cn(
                                                "text-xs text-gray-600 line-clamp-2 mb-4 min-h-[2.5rem]",
                                                todo.status === "completed" &&
                                                    "text-gray-400"
                                            )}
                                        >
                                            {todo.description}
                                        </p>

                                        {/* Meta Info */}
                                        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                                            {/* Category */}
                                            {todo.category && (
                                                <span className="inline-flex items-center bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                                                    {todo.category.name}
                                                </span>
                                            )}

                                            {/* Due Date */}
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {format(
                                                    new Date(todo.due_date),
                                                    "MMM dd"
                                                )}
                                            </span>

                                            {/* Time */}
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {todo.due_time}
                                            </span>

                                            {/* Reminder */}
                                            {todo.reminder && (
                                                <span className="inline-flex items-center text-blue-600">
                                                    <Bell className="h-3 w-3" />
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleComplete(todo.id)
                                                }
                                                className={cn(
                                                    "flex-1 h-8 text-xs font-medium",
                                                    todo.status === "completed"
                                                        ? "text-gray-500 hover:text-gray-600"
                                                        : "text-green-600 hover:text-green-700 hover:bg-green-50"
                                                )}
                                            >
                                                {todo.status === "completed" ? (
                                                    <>
                                                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                                        Completed
                                                    </>
                                                ) : (
                                                    <>
                                                        <Circle className="h-3.5 w-3.5 mr-1.5" />
                                                        Mark Complete
                                                    </>
                                                )}
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-[160px]"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEdit(todo.id)
                                                        }
                                                    >
                                                        <Pencil className="h-3.5 w-3.5 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDelete(
                                                                todo.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:!text-red-700 hover:!bg-red-50"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-xs font-semibold text-gray-600 text-left"
                                            >
                                                TASK DETAILS
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-xs font-semibold text-gray-600 text-left"
                                            >
                                                DUE DATE
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-xs font-semibold text-gray-600 text-left"
                                            >
                                                PRIORITY
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-xs font-semibold text-gray-600 text-left"
                                            >
                                                STATUS
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-xs font-semibold text-gray-600 text-right"
                                            >
                                                ACTIONS
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {todos.map((todo) => (
                                            <tr
                                                key={todo.id}
                                                className={cn(
                                                    "hover:bg-gray-50/50 transition-colors",
                                                    todo.status ===
                                                        "completed" &&
                                                        "bg-gray-50/50"
                                                )}
                                            >
                                                {/* Task Details */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleComplete(
                                                                    todo.id
                                                                )
                                                            }
                                                            className="h-6 w-6 p-0"
                                                        >
                                                            {todo.status ===
                                                            "completed" ? (
                                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                            ) : (
                                                                <Circle className="h-5 w-5 text-gray-300 hover:text-gray-400" />
                                                            )}
                                                        </Button>
                                                        <div className="flex-1 min-w-[200px]">
                                                            <div className="flex items-center gap-2">
                                                                <h3
                                                                    className={cn(
                                                                        "text-sm font-medium text-gray-900",
                                                                        todo.status ===
                                                                            "completed" &&
                                                                            "line-through text-gray-500"
                                                                    )}
                                                                >
                                                                    {todo.title}
                                                                </h3>
                                                                {todo.reminder && (
                                                                    <Bell className="h-3 w-3 text-blue-500" />
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {todo.category && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                                                        {
                                                                            todo
                                                                                .category
                                                                                .name
                                                                        }
                                                                    </span>
                                                                )}
                                                                <p className="text-xs text-gray-500 line-clamp-1">
                                                                    {
                                                                        todo.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Due Date */}
                                                <td className="px-6 py-4 align-middle">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-gray-900">
                                                            {format(
                                                                new Date(
                                                                    todo.due_date
                                                                ),
                                                                "MMM dd, yyyy"
                                                            )}
                                                        </span>
                                                        <span className="text-xs text-gray-500 mt-0.5">
                                                            {todo.due_time}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Priority */}
                                                <td className="px-6 py-4 align-middle">
                                                    <span
                                                        className={cn(
                                                            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                                                            todo.priority ===
                                                                "high"
                                                                ? "bg-red-50 text-red-700"
                                                                : todo.priority ===
                                                                  "medium"
                                                                ? "bg-yellow-50 text-yellow-700"
                                                                : "bg-green-50 text-green-700"
                                                        )}
                                                    >
                                                        <span
                                                            className={cn(
                                                                "h-1.5 w-1.5 rounded-full",
                                                                todo.priority ===
                                                                    "high"
                                                                    ? "bg-red-500"
                                                                    : todo.priority ===
                                                                      "medium"
                                                                    ? "bg-yellow-500"
                                                                    : "bg-green-500"
                                                            )}
                                                        />
                                                        {todo.priority
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            todo.priority.slice(
                                                                1
                                                            )}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4 align-middle">
                                                    <span
                                                        className={cn(
                                                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                                                            todo.status ===
                                                                "completed"
                                                                ? "bg-green-50 text-green-700"
                                                                : "bg-yellow-50 text-yellow-700"
                                                        )}
                                                    >
                                                        {todo.status ===
                                                        "completed"
                                                            ? "Completed"
                                                            : "In Progress"}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    todo.id
                                                                )
                                                            }
                                                            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    todo.id
                                                                )
                                                            }
                                                            className="h-8 w-8 p-0 text-gray-600 hover:text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
