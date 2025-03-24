import { useState } from "react";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Calendar } from "@/Components/ui/calendar";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditTaskDialog({ isOpen, onClose, todo, categories }) {
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
                                <SelectItem value="medium">Medium</SelectItem>
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
}
