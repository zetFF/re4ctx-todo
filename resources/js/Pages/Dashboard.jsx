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

export default function Dashboard({ auth, todos, categories, stats }) {
    const [viewType, setViewType] = useState("grid");
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

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high":
                return {
                    bg: "bg-red-100",
                    text: "text-red-700",
                    border: "border-red-200",
                };
            case "medium":
                return {
                    bg: "bg-yellow-100",
                    text: "text-yellow-700",
                    border: "border-yellow-200",
                };
            case "low":
                return {
                    bg: "bg-green-100",
                    text: "text-green-700",
                    border: "border-green-200",
                };
            default:
                return {
                    bg: "bg-gray-100",
                    text: "text-gray-700",
                    border: "border-gray-200",
                };
        }
    };

    const getCategoryColor = (categoryId) => {
        const colors = [
            {
                bg: "bg-blue-100",
                text: "text-blue-700",
                border: "border-blue-200",
            },
            {
                bg: "bg-purple-100",
                text: "text-purple-700",
                border: "border-purple-200",
            },
            {
                bg: "bg-pink-100",
                text: "text-pink-700",
                border: "border-pink-200",
            },
            {
                bg: "bg-indigo-100",
                text: "text-indigo-700",
                border: "border-indigo-200",
            },
            {
                bg: "bg-cyan-100",
                text: "text-cyan-700",
                border: "border-cyan-200",
            },
        ];

        return colors[categoryId % colors.length];
    };

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

    const EditTaskDialog = ({ isOpen, onClose, todo, categories }) => {
        const [formData, setFormData] = useState({
            title: todo?.title || "",
            description: todo?.description || "",
            priority: todo?.priority || "medium",
            category_id: todo?.category_id?.toString() || "",
            due_date: todo?.due_date || format(new Date(), "yyyy-MM-dd"),
            due_time: todo?.due_time || "12:00",
            reminder: todo?.reminder || false,
        });
        const [selectedDate, setSelectedDate] = useState(
            todo?.due_date ? new Date(todo.due_date) : new Date()
        );
        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleSubmit = (e) => {
            e.preventDefault();
            setIsSubmitting(true);

            router.put(route("todos.update", todo.id), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    onClose();
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            });
        };

        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>
                            Make changes to your task here.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                placeholder="Task title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="Task description"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        priority: value,
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category_id}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        category_id: value,
                                    }))
                                }
                            >
                                <SelectTrigger>
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
                                            !formData.due_date &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.due_date ? (
                                            format(
                                                new Date(formData.due_date),
                                                "PPP"
                                            )
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => {
                                            setSelectedDate(date);
                                            setFormData((prev) => ({
                                                ...prev,
                                                due_date: format(
                                                    date,
                                                    "yyyy-MM-dd"
                                                ),
                                            }));
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time">Due Time</Label>
                            <Input
                                type="time"
                                id="time"
                                value={formData.due_time}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        due_time: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="reminder"
                                checked={formData.reminder}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        reminder: checked,
                                    }))
                                }
                            />
                            <Label htmlFor="reminder">Set Reminder</Label>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Task"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    };

    const filteredTodos = useMemo(() => {
        return todos
            .filter((todo) => {
                const matchesSearch =
                    todo.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    todo.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());
                const matchesStatus =
                    filterStatus === "all"
                        ? true
                        : todo.status === filterStatus;
                const matchesPriority =
                    filterPriority === "all"
                        ? true
                        : todo.priority === filterPriority;
                const matchesCategory =
                    filterCategory === "all"
                        ? true
                        : todo.category_id.toString() === filterCategory;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority &&
                    matchesCategory
                );
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "due_date":
                        return new Date(a.due_date) - new Date(b.due_date);
                    case "priority":
                        const priorityOrder = { high: 1, medium: 2, low: 3 };
                        return (
                            priorityOrder[a.priority] -
                            priorityOrder[b.priority]
                        );
                    case "title":
                        return a.title.localeCompare(b.title);
                    default:
                        return 0;
                }
            });
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

    const TodoGrid = () => (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-6">
            {filteredTodos.map((todo) => (
                <Card
                    key={todo.id}
                    className={cn(
                        "group hover:shadow-lg transition-all duration-300 overflow-hidden",
                        todo.status === "completed" && "bg-gray-50"
                    )}
                >
                    <div
                        className="w-full h-1.5"
                        style={{
                            backgroundColor:
                                todo.priority === "high"
                                    ? "#ef4444"
                                    : todo.priority === "medium"
                                    ? "#f59e0b"
                                    : "#22c55e",
                        }}
                    />
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3
                                    className={cn(
                                        "text-lg font-semibold line-clamp-1 mb-1",
                                        todo.status === "completed" &&
                                            "line-through text-gray-400"
                                    )}
                                >
                                    {todo.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                            getPriorityColor(todo.priority).bg,
                                            getPriorityColor(todo.priority).text
                                        )}
                                    >
                                        {todo.priority}
                                    </span>
                                    {todo.category && (
                                        <span
                                            className={cn(
                                                "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                                getCategoryColor(
                                                    todo.category_id
                                                ).bg,
                                                getCategoryColor(
                                                    todo.category_id
                                                ).text
                                            )}
                                        >
                                            {
                                                categories.find(
                                                    (c) =>
                                                        c.id ===
                                                        todo.category_id
                                                )?.name
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-8 w-8 rounded-full",
                                    todo.status === "completed"
                                        ? "text-green-500 bg-green-50"
                                        : "text-gray-400 hover:text-green-500 hover:bg-green-50"
                                )}
                                onClick={() => handleComplete(todo.id)}
                            >
                                <CheckCircle2 className="h-5 w-5" />
                            </Button>
                        </div>

                        <p
                            className={cn(
                                "text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-4",
                                todo.status === "completed" && "text-gray-400"
                            )}
                        >
                            {todo.description || "No description provided"}
                        </p>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {format(
                                            new Date(todo.due_date),
                                            "MMM dd, yyyy"
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    <span>{todo.due_time}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 h-9 hover:bg-gray-100"
                                    onClick={() => handleEdit(todo)}
                                >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 h-9 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => handleDelete(todo)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);

    const getCurrentTodos = () => {
        const indexOfLastTodo = currentPage * itemsPerPage;
        const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
        return filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
    };

    const TodoTable = () => (
        <div className="rounded-lg border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-white">
                        <TableHead className="w-[5%]">Status</TableHead>
                        <TableHead className="w-[35%]">Task</TableHead>
                        <TableHead className="hidden md:table-cell w-[10%]">
                            Priority
                        </TableHead>
                        <TableHead className="hidden md:table-cell w-[15%]">
                            Category
                        </TableHead>
                        <TableHead className="hidden md:table-cell w-[20%]">
                            Due Date
                        </TableHead>
                        <TableHead className="w-[15%] text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {getCurrentTodos().map((todo, index) => (
                        <TableRow
                            key={todo.id}
                            className={cn(
                                "group hover:bg-white transition-colors",
                                todo.status === "completed" && "bg-gray-50/50",
                                "border-b last:border-b-0"
                            )}
                        >
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "h-8 w-8",
                                        todo.status === "completed"
                                            ? "text-green-500"
                                            : "text-gray-400 hover:text-green-500"
                                    )}
                                    onClick={() => handleComplete(todo.id)}
                                >
                                    <CheckCircle2 className="h-5 w-5" />
                                </Button>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span
                                        className={cn(
                                            "font-medium",
                                            todo.status === "completed" &&
                                                "line-through text-gray-400"
                                        )}
                                    >
                                        {todo.title}
                                    </span>
                                    <span className="text-sm text-gray-500 line-clamp-1">
                                        {todo.description}
                                    </span>
                                    {/* Mobile-only badges */}
                                    <div className="flex flex-wrap gap-2 mt-2 md:hidden">
                                        <span
                                            className={cn(
                                                "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                                getPriorityColor(todo.priority)
                                                    .bg,
                                                getPriorityColor(todo.priority)
                                                    .text
                                            )}
                                        >
                                            {todo.priority}
                                        </span>
                                        {todo.category && (
                                            <span
                                                className={cn(
                                                    "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                                    getCategoryColor(
                                                        todo.category_id
                                                    ).bg,
                                                    getCategoryColor(
                                                        todo.category_id
                                                    ).text
                                                )}
                                            >
                                                {
                                                    categories.find(
                                                        (c) =>
                                                            c.id ===
                                                            todo.category_id
                                                    )?.name
                                                }
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {format(
                                                new Date(todo.due_date),
                                                "MMM dd, yyyy"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <span
                                    className={cn(
                                        "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                        getPriorityColor(todo.priority).bg,
                                        getPriorityColor(todo.priority).text
                                    )}
                                >
                                    {todo.priority}
                                </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {todo.category && (
                                    <span
                                        className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                            getCategoryColor(todo.category_id)
                                                .bg,
                                            getCategoryColor(todo.category_id)
                                                .text
                                        )}
                                    >
                                        {
                                            categories.find(
                                                (c) => c.id === todo.category_id
                                            )?.name
                                        }
                                    </span>
                                )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">
                                        {format(
                                            new Date(todo.due_date),
                                            "MMM dd, yyyy"
                                        )}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                {/* Desktop Actions */}
                                <div className="hidden md:flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8"
                                        onClick={() => handleEdit(todo)}
                                    >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDelete(todo)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>

                                {/* Mobile Actions */}
                                <div className="md:hidden">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-48"
                                        >
                                            <DropdownMenuItem
                                                onClick={() => handleEdit(todo)}
                                                className="cursor-pointer"
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit Task
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleDelete(todo)
                                                }
                                                className="cursor-pointer text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Task
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="flex-1 text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredTodos.length)}{" "}
                    of {filteredTodos.length} results
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((page) => (
                            <Button
                                key={page}
                                variant={
                                    currentPage === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={cn(
                                    "h-8 w-8 p-0",
                                    currentPage === page &&
                                        "bg-primary text-primary-foreground"
                                )}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );

    const DeleteConfirmDialog = () => (
        <AlertDialog
            open={!!todoToDelete}
            onOpenChange={() => setTodoToDelete(null)}
        >
            <AlertDialogContent className="max-w-[400px]">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-red-100">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <AlertDialogTitle className="text-xl">
                            Delete Task
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="pt-4">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border mb-4">
                            <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-medium text-gray-900">
                                    {todoToDelete?.title}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {todoToDelete?.description ||
                                        "No description provided"}
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-600">
                            Are you sure you want to delete this task? This
                            action cannot be undone.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                    <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-end gap-2">
                        <AlertDialogCancel
                            className="mt-0 w-full sm:w-auto"
                            onClick={() => setTodoToDelete(null)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            onClick={confirmDelete}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Task
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="w-full">
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
                            {FiltersDropdown}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowStats(!showStats)}
                                className="flex items-center gap-2"
                            >
                                {showStats ? (
                                    <ChevronDown className="h-4 w-4 transition-transform" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 transition-transform" />
                                )}
                                <span className="font-medium">
                                    Statistics Overview
                                </span>
                            </Button>
                            {!showStats && (
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        Total: {stats.total}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                        Done: {stats.completed}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                        Pending: {stats.pending}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className={cn(
                            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300",
                            showStats
                                ? "opacity-100 max-h-[500px] mb-96 lg:mb-5"
                                : "opacity-0 max-h-0 overflow-hidden"
                        )}
                    >
                        {/* Total Tasks Card */}
                        <Card className="group hover:shadow-lg  transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-300" />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        Total Tasks
                                    </CardTitle>
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                                        <ClipboardList className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold tracking-tight">
                                            {stats.total}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            All tasks in your list
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="text-sm font-medium text-green-600">
                                            +{stats.newTasks || 0}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            vs last week
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="font-medium">
                                            Completion Rate
                                        </span>
                                        <span className="text-muted-foreground">
                                            {Math.round(
                                                (stats.completed /
                                                    stats.total) *
                                                    100
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-50">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                                            style={{
                                                width: `${
                                                    (stats.completed /
                                                        stats.total) *
                                                    100
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Completed Tasks Card */}
                        <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                                <div className="absolute inset-0 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-300" />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        Completed Tasks
                                    </CardTitle>
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-50 to-green-100 group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold tracking-tight text-green-600">
                                            {stats.completed}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Tasks completed
                                        </p>
                                    </div>
                                    <div className="h-[48px] w-[100px]">
                                        {/* Mini bar chart could go here */}
                                        <div className="flex items-end justify-between h-full gap-1">
                                            {[...Array(7)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-2 bg-green-100 rounded-full"
                                                    style={{
                                                        height: `${
                                                            Math.random() * 100
                                                        }%`,
                                                    }}
                                                >
                                                    <div
                                                        className="w-full bg-green-500 rounded-full transition-all duration-500"
                                                        style={{
                                                            height: `${
                                                                Math.random() *
                                                                100
                                                            }%`,
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 pt-2 border-t">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                        <span className="text-xs">
                                            Today: {stats.completedToday || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-green-200" />
                                        <span className="text-xs">
                                            Week: {stats.completedThisWeek || 0}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pending Tasks Card */}
                        <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                                <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all duration-300" />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        Pending Tasks
                                    </CardTitle>
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 group-hover:from-yellow-100 group-hover:to-yellow-200 transition-all duration-300">
                                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold tracking-tight text-yellow-600">
                                            {stats.pending}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Tasks pending
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex -space-x-2">
                                            {[...Array(3)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center"
                                                >
                                                    <Clock className="h-3 w-3 text-yellow-600" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span>Priority Distribution</span>
                                    </div>
                                    <div className="flex gap-1 h-1.5">
                                        <div className="w-1/2 rounded-full bg-red-500" />
                                        <div className="w-1/3 rounded-full bg-yellow-500" />
                                        <div className="w-1/6 rounded-full bg-green-500" />
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                        <span>High</span>
                                        <span>Medium</span>
                                        <span>Low</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Due Today Card */}
                        <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                                <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-300" />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        Due Today
                                    </CardTitle>
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-300">
                                        <Calendar className="w-4 h-4 text-purple-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold tracking-tight text-purple-600">
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
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Tasks due today
                                        </p>
                                    </div>
                                    <div className="relative h-[48px] w-[48px]">
                                        <div className="absolute inset-0 rounded-full bg-purple-100" />
                                        <svg className="transform -rotate-90">
                                            <circle
                                                cx="24"
                                                cy="24"
                                                r="20"
                                                strokeWidth="8"
                                                stroke="currentColor"
                                                fill="none"
                                                className="text-purple-500"
                                                strokeDasharray={`${
                                                    (stats.completed /
                                                        stats.total) *
                                                    125
                                                } 125`}
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs font-medium">
                                            Overdue
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Timer className="h-3 w-3 text-red-500" />
                                            <span className="text-xs text-red-500 font-medium">
                                                {stats.overdue || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs font-medium">
                                            Upcoming
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-purple-500" />
                                            <span className="text-xs text-purple-500 font-medium">
                                                {stats.upcoming || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                        <div className="flex flex-col md:flex-row gap-3 md:items-center flex-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="search"
                                    placeholder="Search tasks..."
                                    className="pl-10 w-full lg:w-1/4"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-3">
                            <div className="flex items-center gap-2">
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
                            </div>
                            {AddTaskDialog}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="p-4">
                <div className="mx-auto">
                    {viewType === "grid" ? <TodoTable /> : <TodoGrid />}
                </div>
            </div>
            {BulkActionsToolbar}
            <DeleteConfirmDialog />
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
