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

    const TodoTable = () => (
        <div className="rounded-lg border shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="w-[5%]">Status</TableHead>
                        <TableHead className="w-[35%]">Task</TableHead>
                        <TableHead className="w-[10%]">Priority</TableHead>
                        <TableHead className="w-[15%]">Category</TableHead>
                        <TableHead className="w-[20%]">Due Date</TableHead>
                        <TableHead className="w-[15%] text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTodos.map((todo) => (
                        <TableRow
                            key={todo.id}
                            className={cn(
                                "group hover:bg-gray-50 transition-colors",
                                todo.status === "completed" && "bg-gray-50/50"
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
                                </div>
                            </TableCell>
                            <TableCell>
                                <span
                                    className={cn(
                                        "px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center capitalize",
                                        getPriorityColor(todo.priority).bg,
                                        getPriorityColor(todo.priority).text
                                    )}
                                >
                                    {todo.priority}
                                </span>
                            </TableCell>
                            <TableCell>
                                {todo.category && (
                                    <span
                                        className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center capitalize",
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
                            <TableCell>
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
                            <TableCell>
                                <div className="flex justify-end gap-2">
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
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

            <div className="p-4">
                <div className="mx-auto">
                    {viewType === "grid" ? <TodoGrid /> : <TodoTable />}
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
