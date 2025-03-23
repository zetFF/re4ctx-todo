import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Calendar } from "@/Components/ui/calendar";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
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
} from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Progress } from "@/Components/ui/progress";

export default function Upcoming({ auth, upcomingTasks }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState("");

    // Group tasks by date
    const tasksByDate = upcomingTasks.reduce((acc, task) => {
        const date = format(new Date(task.due_date), "yyyy-MM-dd");
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(task);
        return acc;
    }, {});

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Upcoming Tasks" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Upcoming Tasks
                        </h2>
                        <p className="text-muted-foreground">
                            Plan and manage your upcoming activities
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-purple-50 border-none">
                            <CardContent className="pt-4">
                                <div className="flex justify-between">
                                    <div className="rounded-full bg-purple-100 p-2">
                                        <CheckCircle2 className="h-4 w-4 text-purple-500" />
                                    </div>
                                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                        This Week
                                    </span>
                                </div>
                                <div className="mt-3">
                                    <p className="text-2xl font-bold">
                                        {upcomingTasks.length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Total Tasks
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 border-none">
                            <CardContent className="pt-4">
                                <div className="flex justify-between">
                                    <div className="rounded-full bg-blue-100 p-2">
                                        <AlertCircle className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                        Priority
                                    </span>
                                </div>
                                <div className="mt-3">
                                    <p className="text-2xl font-bold">
                                        {
                                            upcomingTasks.filter(
                                                (t) => t.priority === "high"
                                            ).length
                                        }
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        High Priority
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Add more stat cards as needed */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Calendar Section with Quick Actions */}
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Calendar</CardTitle>
                                    <Button variant="outline" size="sm">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filter
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="rounded-md border"
                                />
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-medium">
                                        Quick Stats
                                    </p>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Weekly Progress</span>
                                                <span>65%</span>
                                            </div>
                                            <Progress
                                                value={65}
                                                className="h-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tasks List with Search */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <div className="flex justify-between items-center mb-4">
                                    <CardTitle>Upcoming Tasks</CardTitle>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search tasks..."
                                                className="pl-8"
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {Object.entries(tasksByDate).map(
                                        ([date, tasks]) => (
                                            <div
                                                key={date}
                                                className="space-y-4"
                                            >
                                                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                                                    <CalendarIcon className="h-5 w-5 text-primary" />
                                                    <h3 className="font-semibold">
                                                        {format(
                                                            new Date(date),
                                                            "EEEE, MMMM d, yyyy"
                                                        )}
                                                    </h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {tasks.map((task) => (
                                                        <div
                                                            key={task.id}
                                                            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                                                        >
                                                            <div className="space-y-1 flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium">
                                                                        {
                                                                            task.title
                                                                        }
                                                                    </span>
                                                                    <Badge
                                                                        variant={
                                                                            task.priority
                                                                        }
                                                                        className="capitalize"
                                                                    >
                                                                        {
                                                                            task.priority
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                                    {
                                                                        task.description
                                                                    }
                                                                </p>
                                                                <div className="flex items-center gap-4 mt-2">
                                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                        <Clock className="h-4 w-4" />
                                                                        {
                                                                            task.due_time
                                                                        }
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                        <Tag className="h-4 w-4" />
                                                                        {
                                                                            task.category
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
