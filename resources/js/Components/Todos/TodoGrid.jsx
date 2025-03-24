import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Calendar, CheckCircle2, Clock, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPriorityColor, getCategoryColor } from "@/utils/colorUtils";

export default function TodoGrid({
    filteredTodos,
    categories,
    handleComplete,
    handleEdit,
    handleDelete,
}) {
    return (
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
}
