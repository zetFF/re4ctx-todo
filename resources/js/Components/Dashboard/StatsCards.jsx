import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    Timer,
} from "lucide-react";

export default function StatsCards({ stats, todos }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Progress Overview Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-300" />
                </div>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                            Progress Overview
                        </CardTitle>
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                            <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <div className="text-3xl font-bold text-blue-600">
                                {Math.round(
                                    (stats.completed / stats.total) * 100
                                )}
                                %
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Overall completion
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-medium">
                                {stats.completed}/{stats.total}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span>Progress</span>
                            <span className="font-medium">
                                {stats.completed}/{stats.total}
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-50">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                                style={{
                                    width: `${
                                        (stats.completed / stats.total) * 100
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
                                            height: `${Math.random() * 100}%`,
                                        }}
                                    >
                                        <div
                                            className="w-full bg-green-500 rounded-full transition-all duration-500"
                                            style={{
                                                height: `${
                                                    Math.random() * 100
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
                                        (stats.completed / stats.total) * 125
                                    } 125`}
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div className="flex flex-col gap-1">
                            <div className="text-xs font-medium">Overdue</div>
                            <div className="flex items-center gap-1">
                                <Timer className="h-3 w-3 text-red-500" />
                                <span className="text-xs text-red-500 font-medium">
                                    {stats.overdue || 0}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-xs font-medium">Upcoming</div>
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
    );
}
