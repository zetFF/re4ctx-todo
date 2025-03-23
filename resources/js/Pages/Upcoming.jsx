import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Calendar } from "@/Components/ui/calendar";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Clock, Calendar as CalendarIcon } from "lucide-react";

export default function Upcoming({ auth, upcomingTasks }) {
    const [selectedDate, setSelectedDate] = useState(new Date());

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Calendar Section */}
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Calendar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="rounded-md border"
                                />
                            </CardContent>
                        </Card>

                        {/* Upcoming Tasks List */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Upcoming Tasks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {Object.entries(tasksByDate).map(
                                        ([date, tasks]) => (
                                            <div
                                                key={date}
                                                className="space-y-4"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="h-5 w-5 text-gray-500" />
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
                                                            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                                                        >
                                                            <div className="space-y-1">
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
                                                                    >
                                                                        {
                                                                            task.priority
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {
                                                                        task.description
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-gray-500" />
                                                                <span className="text-sm">
                                                                    {
                                                                        task.due_time
                                                                    }
                                                                </span>
                                                            </div>
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
