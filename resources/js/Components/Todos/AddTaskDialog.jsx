import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar as DatePicker } from "@/Components/ui/calendar";
import { Calendar as CalendarIcon, Plus } from "lucide-react";

export default function AddTaskDialog({ categories }) {
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
                            onChange={(e) => setData("title", e.target.value)}
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
                                <SelectItem value="medium">Medium</SelectItem>
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
                                        !selectedDate && "text-muted-foreground"
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
}
