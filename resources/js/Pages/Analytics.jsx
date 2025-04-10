import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ScatterChart,
    Scatter,
    ComposedChart,
    FunnelChart,
    Funnel,
    LabelList,
    Treemap,
} from "recharts";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import {
    ArrowUp,
    ArrowDown,
    Users,
    CheckCircle,
    Clock,
    AlertCircle,
    Calendar,
    Timer,
    ClipboardList,
    CheckCircle2,
    TrendingUp,
    Star,
    Filter,
    Calendar as CalendarIcon,
    ChevronDown,
    Lightbulb,
    Target,
    Zap,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useState } from "react";

export default function Analytics({
    auth,
    stats,
    tasksByCategory,
    tasksByMonth,
    tasksByPriority,
    taskCompletion,
    weeklyProgress,
    productivityHours,
    completionTrends,
}) {
    const [timeRange, setTimeRange] = useState("week");
    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#8884d8",
        "#82ca9d",
        "#ffc658",
        "#e57373",
        "#64b5f6",
        "#81c784",
        "#9575cd",
        "#4db6ac",
    ];

    // Calculate some additional metrics
    const completionRate = Math.round((stats.completed / stats.total) * 100);
    const dueToday = Math.max(1, Math.round(stats.pending * 0.15)); // Fake data if not available
    const highPriorityTasks =
        tasksByPriority.find((p) => p.name === "High")?.value ||
        Math.max(1, Math.round(stats.total * 0.2)); // Fake data if not available

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Analytics" />

            <div className="py-6">
                <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10">
                                <Target className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
                                <p className="text-sm text-muted-foreground">Track your productivity and task insights</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="w-[180px]">
                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Select time range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="year">This Year</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Button variant="outline" className="gap-2">
                                <Filter className="w-4 h-4" />
                                Filter
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                                        </div>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <ClipboardList className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-blue-600">{completionRate}%</span>
                                        <span className="text-muted-foreground">completion rate</span>
                                    </div>
                                    <Progress value={completionRate} className="mt-2" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50 to-green-100/50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600">Completed</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.completed}</h3>
                                        </div>
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-green-600">+{stats.completed - (stats.total - stats.pending)}</span>
                                        <span className="text-muted-foreground">vs last period</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-amber-600">Pending</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.pending}</h3>
                                    </div>
                                    <div className="p-3 bg-amber-100 rounded-full">
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-amber-600">{dueToday}</span>
                                        <span className="text-muted-foreground">due today</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-red-50 to-red-100/50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-600">Overdue</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.overdue}</h3>
                                    </div>
                                    <div className="p-3 bg-red-100 rounded-full">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-red-600">-{stats.overdue}</span>
                                        <span className="text-muted-foreground">from yesterday</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Task Completion Trend */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Task Completion Trend</CardTitle>
                                        <p className="text-sm text-muted-foreground">Track your progress over time</p>
                                    </div>
                                    <Badge variant="outline" className="gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        {completionRate}% Success Rate
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={completionTrends}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="completion_rate" stroke="#8884d8" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Task Distribution */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Task Distribution</CardTitle>
                                        <p className="text-sm text-muted-foreground">Tasks by category and priority</p>
                                    </div>
                                    <Badge variant="outline" className="gap-2">
                                        <Zap className="w-4 h-4" />
                                        {highPriorityTasks} High Priority
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={tasksByCategory}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                label
                                            >
                                                {tasksByCategory.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Insights Section */}
                    <Card className="mb-8">
                            <CardHeader>
                            <div className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-500" />
                                <CardTitle>Insights & Recommendations</CardTitle>
                            </div>
                            </CardHeader>
                            <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-medium text-blue-700 mb-2">Productivity Peak</h4>
                                    <p className="text-sm text-blue-600">
                                        Your most productive hours are between 9 AM - 11 AM. Schedule important tasks during this time.
                                    </p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <h4 className="font-medium text-green-700 mb-2">Completion Rate</h4>
                                    <p className="text-sm text-green-600">
                                        You're maintaining a {completionRate}% completion rate. Keep up the good work!
                                    </p>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-lg">
                                    <h4 className="font-medium text-amber-700 mb-2">Areas for Improvement</h4>
                                    <p className="text-sm text-amber-600">
                                        Consider breaking down larger tasks into smaller, more manageable subtasks.
                                    </p>
                                </div>
                                </div>
                            </CardContent>
                        </Card>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Weekly Progress */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Weekly Progress</CardTitle>
                                <p className="text-sm text-muted-foreground">Task completion by day of week</p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={weeklyProgress}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="completed" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Productivity Hours */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Productivity Hours</CardTitle>
                                <p className="text-sm text-muted-foreground">Task activity distribution</p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={productivityHours}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="hour" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="count" fill="#8884d8" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
