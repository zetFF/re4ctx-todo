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
import { useState, useMemo, useEffect, useCallback } from "react";
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
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Timer,
    ChevronDown,
    X,
    ChartPieIcon,
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
    DialogFooter,
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
import { getPriorityColor, getCategoryColor } from "@/utils/colorUtils";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

// Import komponen-komponen yang telah dipisahkan
import StatsCards from "@/Components/Dashboard/StatsCards";
import AddTaskDialog from "@/Components/Todos/AddTaskDialog";
import EditTaskDialog from "@/Components/Todos/EditTaskDialog";
import DeleteConfirmDialog from "@/Components/Todos/DeleteConfirmDialog";
import TodoGrid from "@/Components/Todos/TodoGrid";
import TodoTable from "@/Components/Todos/TodoTable";

export default function Dashboard({ auth, todos, categories, stats }) {
    const [viewType, setViewType] = useState("table");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState("12:00");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");
    const [filterCategory, setFilterCategory] = useState("all");
    const [sortBy, setSortBy] = useState("due_date");
    const [todoToDelete, setTodoToDelete] = useState(null);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Jumlah item per halaman
    const [showStats, setShowStats] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: "",
        description: "",
        priority: "medium",
        category_id: "",
        due_date: format(new Date(), "yyyy-MM-dd"),
        due_time: "12:00",
        reminder: false,
    });

    useEffect(() => {
        if (selectedTodo) {
            setData({
                title: selectedTodo.title,
                description: selectedTodo.description || "",
                priority: selectedTodo.priority,
                category_id: selectedTodo.category_id
                    ? selectedTodo.category_id.toString()
                    : "",
                due_date: selectedTodo.due_date,
                due_time: selectedTodo.due_time,
                reminder: selectedTodo.reminder || false,
            });
            setSelectedDate(new Date(selectedTodo.due_date));
            setSelectedTime(selectedTodo.due_time);
        }
    }, [selectedTodo]);

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

    const handleEdit = useCallback((todo) => {
        setSelectedTodo(todo);
        setIsEditOpen(true);
    }, []);

    const handleCloseEdit = useCallback(() => {
        setIsEditOpen(false);
        setSelectedTodo(null);
    }, []);

    const handleUpdate = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.put(route("todos.update", selectedTodo.id), data, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditOpen(false);
                setSelectedTodo(null);
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const handleDelete = (todo) => {
        setTodoToDelete(todo);
    };

    const confirmDelete = () => {
        if (todoToDelete) {
            router.delete(route("todos.destroy", todoToDelete.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setTodoToDelete(null);
                    // Optional: Add success toast notification
                },
                onError: () => {
                    // Optional: Add error toast notification
                },
            });
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const filteredTodos = useMemo(() => {
        let filtered = [...todos];

        // Filter berdasarkan search query
        if (searchQuery) {
            filtered = filtered.filter(
                (todo) =>
                    todo.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    (todo.description &&
                        todo.description
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()))
            );
        }

        // Filter berdasarkan status
        if (filterStatus !== "all") {
            filtered = filtered.filter((todo) => todo.status === filterStatus);
        }

        // Filter berdasarkan priority
        if (filterPriority !== "all") {
            filtered = filtered.filter(
                (todo) => todo.priority === filterPriority
            );
        }

        // Filter berdasarkan category
        if (filterCategory !== "all") {
            filtered = filtered.filter(
                (todo) => todo.category_id.toString() === filterCategory
            );
        }

        // Sort todos
        filtered.sort((a, b) => {
            if (sortBy === "due_date") {
                return new Date(a.due_date) - new Date(b.due_date);
            } else if (sortBy === "priority") {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            } else if (sortBy === "title") {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

        return filtered;
    }, [
        todos,
        searchQuery,
        filterStatus,
        filterPriority,
        filterCategory,
        sortBy,
    ]);

    const [selectedTodos, setSelectedTodos] = useState([]);

    const handleBulkComplete = () => {
        selectedTodos.forEach((id) => handleComplete(id));
        setSelectedTodos([]);
    };

    const handleBulkDelete = () => {
        // Implement bulk delete logic
        selectedTodos.forEach((id) => handleDelete(id));
        setSelectedTodos([]);
    };

    const FiltersDropdown = (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Filters</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("due_date")}>
                    Due Date {sortBy === "due_date" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("priority")}>
                    Priority {sortBy === "priority" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("title")}>
                    Title {sortBy === "title" && "✓"}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    All Tasks {filterStatus === "all" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                    Completed {filterStatus === "completed" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                    Pending {filterStatus === "pending" && "✓"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    const BulkActionsToolbar = selectedTodos.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">
                {selectedTodos.length} items selected
            </span>
            <Button
                size="sm"
                variant="outline"
                onClick={handleBulkComplete}
                className="text-green-600 hover:text-green-700"
            >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete All
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={handleBulkDelete}
                className="text-red-600 hover:text-red-700"
            >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All
            </Button>
        </div>
    );

    const SelectionCheckbox = ({ todoId }) => (
        <input
            type="checkbox"
            checked={selectedTodos.includes(todoId)}
            onChange={(e) => {
                if (e.target.checked) {
                    setSelectedTodos([...selectedTodos, todoId]);
                } else {
                    setSelectedTodos(
                        selectedTodos.filter((id) => id !== todoId)
                    );
                }
            }}
            className="h-4 w-4 rounded border-gray-300"
        />
    );

    // Fungsi untuk reset semua filter
    const resetFilters = () => {
        setFilterStatus("all");
        setFilterPriority("all");
        setFilterCategory("all");
        setSortBy("due_date");
        setSearchQuery("");
    };

    // Komponen UI untuk filter panel
    const FiltersPanel = () => (
        <div
            className={`space-y-4 p-4 bg-gray-50 rounded-lg border ${
                showFilters ? "block" : "hidden"
            }`}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Filters</h3>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-xs text-gray-500 h-8"
                    >
                        Reset all
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowFilters(false)}
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-medium">Status</label>
                    <Select
                        value={filterStatus}
                        onValueChange={setFilterStatus}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Priority Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-medium">Priority</label>
                    <Select
                        value={filterPriority}
                        onValueChange={setFilterPriority}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-medium">Category</label>
                    <Select
                        value={filterCategory}
                        onValueChange={setFilterCategory}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
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
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
                <label className="text-xs font-medium">Sort By</label>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={sortBy === "due_date" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("due_date")}
                        className="text-xs h-8"
                    >
                        Due Date
                    </Button>
                    <Button
                        variant={sortBy === "priority" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("priority")}
                        className="text-xs h-8"
                    >
                        Priority
                    </Button>
                    <Button
                        variant={sortBy === "title" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("title")}
                        className="text-xs h-8"
                    >
                        Title
                    </Button>
                </div>
            </div>

            <div className="flex items-center text-xs text-gray-500">
                <div>
                    Showing{" "}
                    <span className="font-medium">{filteredTodos.length}</span>{" "}
                    of <span className="font-medium">{todos.length}</span> tasks
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="w-full">
                    {/* Header bagian atas - Task Overview dan Aksi */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10">
                                <ClipboardList className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                                Task Overview
                            </h2>
                        </div>
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
                            {FiltersDropdown}
                            <AddTaskDialog categories={categories} />
                        </div>
                    </div>

                    {/* Stats Toggle Button - Desain Lebih Menarik */}
                    <div className="relative mb-6">
                        <div className="absolute -left-3 top-0 h-full w-1 bg-gradient-to-b from-primary/50 to-primary/5 rounded-full"></div>
                        <Button
                            variant="ghost"
                            onClick={() => setShowStats(!showStats)}
                            className={`
                                w-full flex items-center justify-between px-3 py-2 
                                transition-all duration-300
                                hover:bg-gray-50 rounded-md group
                                ${showStats ? "mb-2 bg-gray-50/80" : ""}
                            `}
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={`
                                    p-1.5 rounded-md 
                                    ${
                                        showStats
                                            ? "bg-primary/10 text-primary"
                                            : "bg-gray-100 text-gray-500 group-hover:bg-primary/5 group-hover:text-primary/80"
                                    }
                                    transition-all duration-300
                                `}
                                >
                                    <ChartPieIcon className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-left">
                                    Statistics Overview
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                {!showStats && (
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground pr-2">
                                        <span className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            <span className="text-xs">
                                                Total: {stats.total}
                                            </span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <span className="text-xs">
                                                Done: {stats.completed}
                                            </span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                            <span className="text-xs">
                                                Pending: {stats.pending}
                                            </span>
                                        </span>
                                    </div>
                                )}
                                <div
                                    className={`
                                    transition-transform duration-300 
                                    ${showStats ? "rotate-180" : ""}
                                `}
                                >
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </div>
                        </Button>
                    </div>

                    {/* Stats Cards dengan animasi yang lebih mulus */}
                    <div
                        className={cn(
                            "gap-6 transition-all duration-500",
                            showStats
                                ? "opacity-100 max-h-[500px] mb-8"
                                : "opacity-0 max-h-0 overflow-hidden mb-0"
                        )}
                    >
                        <StatsCards stats={stats} todos={todos} />
                    </div>

                    {/* Search dan Filter Tools - Layout diperbaiki */}
                    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                        <div className="flex flex-col md:flex-row gap-3 md:items-center flex-1">
                            <div className="relative flex-1 max-w-md">
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

                            {/* Filter Tags yang lebih menarik */}
                            <div className="flex flex-wrap gap-2">
                                {filterStatus !== "all" && (
                                    <Badge
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 gap-1 px-2 py-1"
                                    >
                                        Status: {filterStatus}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() =>
                                                setFilterStatus("all")
                                            }
                                        />
                                    </Badge>
                                )}
                                {filterPriority !== "all" && (
                                    <Badge
                                        variant="outline"
                                        className="bg-amber-50 text-amber-700 hover:bg-amber-100 gap-1 px-2 py-1"
                                    >
                                        Priority: {filterPriority}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() =>
                                                setFilterPriority("all")
                                            }
                                        />
                                    </Badge>
                                )}
                                {filterCategory !== "all" && (
                                    <Badge
                                        variant="outline"
                                        className="bg-purple-50 text-purple-700 hover:bg-purple-100 gap-1 px-2 py-1"
                                    >
                                        Category:{" "}
                                        {
                                            categories.find(
                                                (c) =>
                                                    c.id.toString() ===
                                                    filterCategory
                                            )?.name
                                        }
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() =>
                                                setFilterCategory("all")
                                            }
                                        />
                                    </Badge>
                                )}
                                {(filterStatus !== "all" ||
                                    filterPriority !== "all" ||
                                    filterCategory !== "all") && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={resetFilters}
                                        className="text-xs h-7 px-2"
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* View Options dengan gaya yang lebih modern */}
                        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
                          

                            <Button
                                variant={
                                    viewType === "table" ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => setViewType("table")}
                                className={
                                    viewType === "table" ? "" : "text-gray-500"
                                }
                            >
                                <List className="h-4 w-4 mr-1" />
                                List
                            </Button>

                            <Button
                                variant={
                                    viewType === "grid" ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => setViewType("grid")}
                                className={
                                    viewType === "grid" ? "" : "text-gray-500"
                                }
                            >
                                <Grid className="h-4 w-4 mr-1" />
                                Grid
                            </Button>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="p-4">
                <div className="mx-auto">
                    {viewType === "table" ? (
                        <TodoTable
                            filteredTodos={filteredTodos}
                            categories={categories}
                            handleComplete={handleComplete}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                        />
                    ) : (
                        <TodoGrid
                            filteredTodos={filteredTodos}
                            categories={categories}
                            handleComplete={handleComplete}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            {/* Gunakan komponen DeleteConfirmDialog yang telah dipisahkan */}
            <DeleteConfirmDialog
                todoToDelete={todoToDelete}
                setTodoToDelete={setTodoToDelete}
            />

            {/* Gunakan komponen EditTaskDialog yang telah dipisahkan */}
            {selectedTodo && (
                <EditTaskDialog
                    isOpen={isEditOpen}
                    onClose={handleCloseEdit}
                    todo={selectedTodo}
                    categories={categories}
                />
            )}
        </AuthenticatedLayout>
    );
}
