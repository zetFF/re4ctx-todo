import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Pencil,
    Trash2,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getPriorityColor, getCategoryColor } from "@/utils/colorUtils";

export default function TodoTable({
    filteredTodos,
    categories,
    handleComplete,
    handleEdit,
    handleDelete,
    currentPage,
    setCurrentPage,
    itemsPerPage,
}) {
    const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);

    const getCurrentTodos = () => {
        const indexOfLastTodo = currentPage * itemsPerPage;
        const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
        return filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
    };

    return (
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
}
