import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
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
    Calendar,
    CheckCircle2,
    Pencil,
    Trash2,
    MoreVertical,
    Circle,
    ClipboardList,
    ChevronDown,
    X,
    ChartPieIcon,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getPriorityColor, getCategoryColor } from "@/utils/colorUtils";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";


// Import komponen-komponen yang telah dipisahkan
import StatsCards from "@/Components/Dashboard/StatsCards";
import AddTaskDialog from "@/Components/Todos/AddTaskDialog";
import EditTaskDialog from "@/Components/Todos/EditTaskDialog";
import DeleteConfirmDialog from "@/Components/Todos/DeleteConfirmDialog";
import TodoGrid from "@/Components/Todos/TodoGrid";
import TodoTable from "@/Components/Todos/TodoTable";
import ImportTasksDialog from "@/Components/Todos/ImportTasksDialog";

// Tambahkan section Statistics Overview yang lebih baik
const StatisticsOverviewHeader = ({ showStats, setShowStats, stats }) => (
    <div className="relative mb-6">
        {/* Gradient line indicator */}
        <div className="absolute -left-3 top-0 h-full w-1 bg-gradient-to-b from-primary/50 to-primary/5 rounded-full"></div>
        
        <Button
            variant="ghost"
            onClick={() => setShowStats(!showStats)}
            className={`
                w-full flex items-center justify-between px-4 py-3
                transition-all duration-300 rounded-lg
                hover:bg-gray-50/80
                ${showStats ? 'bg-gray-50/80 shadow-sm' : ''}
            `}
        >
            <div className="flex items-center gap-3">
                <div className={`
                    p-2 rounded-lg transition-all duration-300
                    ${showStats 
                        ? 'bg-primary/10 text-primary rotate-0' 
                        : 'bg-gray-100 text-gray-500 group-hover:bg-primary/5 group-hover:text-primary/80'}
                `}>
                    <ChartPieIcon className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start">
                    <span className="font-semibold text-gray-700">Statistics Overview</span>
                    <span className="text-xs text-gray-500">Track your task progress and analytics</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Quick Stats Pills - Visible when collapsed */}
                {!showStats && (
                    <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-white/50 rounded-full shadow-sm">
                        <span className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                            <span className="text-sm font-medium text-gray-600">
                                {stats.total} Total
                            </span>
                        </span>
                        <div className="h-4 w-px bg-gray-200" />
                        <span className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                            <span className="text-sm font-medium text-gray-600">
                                {stats.completed} Done
                            </span>
                        </span>
                        <div className="h-4 w-px bg-gray-200" />
                        <span className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                            <span className="text-sm font-medium text-gray-600">
                                {stats.pending} Pending
                            </span>
                        </span>
                    </div>
                )}

                {/* Mobile Quick Stats */}
                {!showStats && (
                    <div className="md:hidden flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                            {stats.total}
                        </Badge>
                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                            {stats.completed}
                        </Badge>
                        <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
                            {stats.pending}
                        </Badge>
                    </div>
                )}

                <div className={`
                    transition-transform duration-300
                    ${showStats ? 'rotate-180' : 'rotate-0'}
                `}>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </Button>
    </div>
);


const MobileStatsOverview = ({ showStats, setShowStats, stats }) => (
    <div className="md:hidden mb-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setShowStats(!showStats)}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/5">
                        <ChartPieIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">Statistics Overview</h3>
                        <p className="text-xs text-gray-500">Track your task progress and analytics</p>
                    </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showStats ? 'rotate-180' : ''}`} />
            </div>

            {/* Quick Stats Pills */}
            <div className="px-4 pb-4 flex gap-2">
                <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 shadow-sm">
                    <p className="text-xs text-blue-600 mb-1">Total</p>
                    <p className="text-lg font-semibold text-blue-700">{stats.total}</p>
                </div>
                <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 shadow-sm">
                    <p className="text-xs text-green-600 mb-1">Done</p>
                    <p className="text-lg font-semibold text-green-700">{stats.completed}</p>
                </div>
                <div className="flex-1 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-2 shadow-sm">
                    <p className="text-xs text-amber-600 mb-1">Pending</p>
                    <p className="text-lg font-semibold text-amber-700">{stats.pending}</p>
                </div>
            </div>
        </div>
    </div>
);

const SearchAndFilterMobile = ({ searchQuery, setSearchQuery, viewType, setViewType, setShowFilters }) => (
    <div className="md:hidden space-y-3">
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 bg-white rounded-lg shadow-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="search"
                    placeholder="Search tasks..."
                    className="pl-10 w-full border-none bg-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            {/* Filter Button */}
            <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => setShowFilters(true)}
            >
                <Filter className="h-4 w-4" />
            </Button>
        </div>
    </div>
);

// Desktop Search Component
const DesktopSearch = ({ searchQuery, setSearchQuery }) => (
    <div className="hidden md:block w-full max-w-md">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-10 w-full bg-white shadow-sm border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    </div>
);

const MobileTaskList = ({ todos, categories, handleComplete, handleEdit, handleDelete }) => (
    <div className="md:hidden mt-4 space-y-3">
        {todos.map((todo) => (
            <div key={todo.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-0.5 p-0 h-auto hover:bg-transparent"
                            onClick={() => handleComplete(todo.id)}
                        >
                            {todo.status === "completed" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                                <Circle className="h-5 w-5 text-gray-300" />
                            )}
                        </Button>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 line-clamp-1">{todo.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{todo.description}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <Badge className={getPriorityColor(todo.priority)}>
                                    {todo.priority}
                                </Badge>
                                {todo.category && (
                                    <Badge variant="outline" className={getCategoryColor(todo.category.color)}>
                                        {todo.category.name}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>{format(new Date(todo.due_date), "MMM dd, yyyy")}</span>
                            </div>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleEdit(todo)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(todo)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        ))}
    </div>
);

// Add FiltersDialog component for mobile
const FiltersDialog = ({ isOpen, setIsOpen, filterStatus, setFilterStatus, filterPriority, setFilterPriority, filterCategory, setFilterCategory, categories, resetFilters }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] p-0">
            <DialogHeader className="px-4 pt-4">
                <DialogTitle>Filter Tasks</DialogTitle>
                <DialogDescription>
                    Apply filters to your tasks list
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 p-4">
                {/* Status Filter */}
                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Tasks</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Priority Filter */}
                <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter className="flex justify-between p-4 border-t">
                <Button variant="ghost" onClick={resetFilters}>
                    Reset All
                </Button>
                <Button onClick={() => setIsOpen(false)}>
                    Apply Filters
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default function Dashboard({ auth, todos, categories, stats }) {
    const [viewType, setViewType] = useState("list");
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
    const itemsPerPage = 10;
    const [showStats, setShowStats] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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

    // Fungsi untuk reset semua filter
    const resetFilters = () => {
        setFilterStatus("all");
        setFilterPriority("all");
        setFilterCategory("all");
        setSortBy("due_date");
        setSearchQuery("");
    };

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Dashboard" />

            <div className="p-4 pb-24 md:p-8">
                {/* Mobile Header */}
                <div className="md:hidden mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/5">
                                <ClipboardList className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Task Overview</h2>
                                <p className="text-xs text-gray-500">Manage your tasks</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="relative"
                            >
                                <Bell className="h-4 w-4" />
                                {stats.pending > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                                        {stats.pending}
                                    </span>
                                )}
                            </Button>
                            <AddTaskDialog categories={categories} />
                        </div>
                    </div>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:block">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/10">
                                <ClipboardList className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Task Overview</h2>
                                <p className="text-sm text-gray-500">Manage and track your tasks efficiently</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {/* View Type Buttons for Desktop */}
                            <div className="hidden md:flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                                <Button
                                    variant={viewType === "list" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewType("list")}
                                    className="h-8 flex items-center justify-center gap-2"
                                >
                                    <List className="h-4 w-4" />
                                    <span className="text-sm">List</span>
                                </Button>
                                <Button
                                    variant={viewType === "grid" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewType("grid")}
                                    className="h-8 flex items-center justify-center gap-2"
                                >
                                    <Grid className="h-4 w-4" />
                                    <span className="text-sm">Grid</span>
                                </Button>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="relative hidden md:flex"
                            >
                                <Bell className="w-4 h-4 mr-2" />
                                Notifications
                                {stats.pending > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                        {stats.pending}
                                    </span>
                                )}
                            </Button>

                            <AddTaskDialog categories={categories} />
                            <ImportTasksDialog />
                        </div>
                    </div>

                    {/* Desktop Search and Filters Row */}
                    <div className="hidden md:flex items-center justify-between gap-4 mb-6">
                        <DesktopSearch 
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                        
                        {/* Active Filters Tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {filterStatus !== "all" && (
                                <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 gap-1 px-2 py-1"
                                >
                                    Status: {filterStatus}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => setFilterStatus("all")}
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
                                        onClick={() => setFilterPriority("all")}
                                    />
                                </Badge>
                            )}
                            {filterCategory !== "all" && (
                                <Badge
                                    variant="outline"
                                    className="bg-purple-50 text-purple-700 hover:bg-purple-100 gap-1 px-2 py-1"
                                >
                                    Category:{" "}
                                    {categories.find(
                                        (c) => c.id.toString() === filterCategory
                                    )?.name}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => setFilterCategory("all")}
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
                </div>

                <MobileStatsOverview 
                    showStats={showStats}
                    setShowStats={setShowStats}
                    stats={stats}
                />

                <div className="hidden md:block">
                    <StatisticsOverviewHeader 
                        showStats={showStats}
                        setShowStats={setShowStats}
                        stats={stats}
                    />
                </div>

                <div className={cn(
                    "transition-all duration-500 ease-in-out",
                    showStats
                        ? "opacity-100 max-h-[800px] mb-12 transform translate-y-0"
                        : "opacity-0 max-h-0 overflow-hidden mb-0 transform -translate-y-4"
                )}>
                    <StatsCards stats={stats} todos={todos} />
                </div>

                <SearchAndFilterMobile 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    viewType={viewType}
                    setViewType={setViewType}
                    setShowFilters={setIsFiltersOpen}
                />

                <FiltersDialog 
                    isOpen={isFiltersOpen}
                    setIsOpen={setIsFiltersOpen}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    filterPriority={filterPriority}
                    setFilterPriority={setFilterPriority}
                    filterCategory={filterCategory}
                    setFilterCategory={setFilterCategory}
                    categories={categories}
                    resetFilters={resetFilters}
                />

                {/* Mobile Task List */}
                <MobileTaskList 
                    todos={filteredTodos}
                    categories={categories}
                    handleComplete={handleComplete}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />

                {/* Desktop Task View */}
                <div className="hidden md:block mt-4">
                    {viewType === "list" ? (
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

                <DeleteConfirmDialog
                    todoToDelete={todoToDelete}
                    setTodoToDelete={setTodoToDelete}
                />

                {selectedTodo && (
                    <EditTaskDialog
                        isOpen={isEditOpen}
                        onClose={handleCloseEdit}
                        todo={selectedTodo}
                        categories={categories}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
