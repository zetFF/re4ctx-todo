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
} from "lucide-react";

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
                <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header with Title and Date - Updated Style */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10">
                                <BarChart className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Analytics Dashboard
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Performance metrics and task insights
                                </p>
                            </div>
                        </div>
                        <Badge
                            variant="outline"
                            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <Calendar className="w-4 h-4 mr-2 text-primary" />
                            Last Updated: {new Date().toLocaleDateString()}
                        </Badge>
                    </div>

                    {/* Stats Cards - 6 Column Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        {/* Total Tasks Card */}
                        <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-300" />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        Total Tasks
                                    </CardTitle>
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                                        <ClipboardList className="h-4 w-4 text-blue-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold tracking-tight text-blue-600">
                                            {stats.total}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            All tasks in your list
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span>Overall Progress</span>
                                        <span className="font-medium">
                                            {stats.completed}/{stats.total}
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
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
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
                                            Completed tasks
                                        </p>
                                    </div>
                                </div>
                                <div className="h-10">
                                    <div className="flex justify-center">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pending Tasks Card */}
                        <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                                <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-300" />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        Pending Tasks
                                    </CardTitle>
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 group-hover:from-amber-100 group-hover:to-amber-200 transition-all duration-300">
                                        <Clock className="h-4 w-4 text-amber-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold tracking-tight text-amber-600">
                                            {stats.pending}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Pending tasks
                                        </p>
                                    </div>
                                </div>
                                <div className="h-10">
                                    <div className="flex justify-center">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <Clock className="h-4 w-4 text-amber-600" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Overdue Tasks Card */}
                        <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                                <div className="absolute inset-0 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-300" />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        Overdue Tasks
                                    </CardTitle>
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-50 to-red-100 group-hover:from-red-100 group-hover:to-red-200 transition-all duration-300">
                                        <Timer className="h-4 w-4 text-red-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold tracking-tight text-red-600">
                                            {stats.overdue}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Overdue tasks
                                        </p>
                                    </div>
                                </div>
                                <div className="h-10">
                                    <div className="flex justify-center">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* NEW: Completion Rate Card */}
                        <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                                <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-300" />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        Completion Rate
                                    </CardTitle>
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-300">
                                        <TrendingUp className="h-4 w-4 text-purple-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold tracking-tight text-purple-600">
                                            {completionRate}%
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Overall efficiency
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span>Target: 80%</span>
                                        <span className="font-medium">
                                            {completionRate > 80
                                                ? "+" + (completionRate - 80)
                                                : "-" + (80 - completionRate)}
                                            %
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gradient-to-r from-purple-100 to-purple-50">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
                                            style={{
                                                width: `${completionRate}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* NEW: High Priority Tasks Card */}
                        <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                                <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all duration-300" />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        Priority Tasks
                                    </CardTitle>
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 group-hover:from-yellow-100 group-hover:to-yellow-200 transition-all duration-300">
                                        <Star className="h-4 w-4 text-yellow-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold tracking-tight text-yellow-600">
                                            {highPriorityTasks}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            High priority tasks
                                        </p>
                                    </div>
                                </div>
                                <div className="h-10">
                                    <div className="flex justify-center">
                                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <Star className="h-4 w-4 text-yellow-600" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        {/* Tasks by Category - Bar Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Tasks by Category
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    Distribution of tasks across categories
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={tasksByCategory}
                                            layout="vertical"
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                horizontal={true}
                                                vertical={false}
                                            />
                                            <XAxis type="number" />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                width={100}
                                            />
                                            <Tooltip
                                                formatter={(value) => [
                                                    `${value} tasks`,
                                                    "Count",
                                                ]}
                                            />
                                            <Bar
                                                dataKey="value"
                                                fill="#8884d8"
                                                name="Tasks"
                                            >
                                                {tasksByCategory.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                COLORS[
                                                                    index %
                                                                        COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Task Completion Trend - Line Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Monthly Task Distribution
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    Tasks created and completed by month
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={tasksByMonth}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                dataKey="completed"
                                                name="Completed"
                                                stackId="a"
                                                fill="#4ade80"
                                            />
                                            <Bar
                                                dataKey="pending"
                                                name="Pending"
                                                stackId="a"
                                                fill="#fb923c"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Task Priority Distribution - Pie Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Priority Distribution
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    Tasks grouped by priority level
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={tasksByPriority}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                                nameKey="name"
                                                label={({ name, percent }) =>
                                                    `${name}: ${(
                                                        percent * 100
                                                    ).toFixed(0)}%`
                                                }
                                            >
                                                {tasksByPriority.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                COLORS[
                                                                    index %
                                                                        COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value, name) => [
                                                    `${value} tasks`,
                                                    name,
                                                ]}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Weekly Progress - Radar Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Weekly Task Completion
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    Task completion rate by day of week
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <RadarChart
                                            outerRadius={90}
                                            data={taskCompletion}
                                        >
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="subject" />
                                            <PolarRadiusAxis
                                                angle={30}
                                                domain={[0, 100]}
                                            />
                                            <Radar
                                                name="Completion %"
                                                dataKey="A"
                                                stroke="#8884d8"
                                                fill="#8884d8"
                                                fillOpacity={0.6}
                                            />
                                            <Tooltip
                                                formatter={(value) => [
                                                    `${value}%`,
                                                    "Completion Rate",
                                                ]}
                                            />
                                            <Legend />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Productivity by Hour - Area Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Productivity by Hour
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    Tasks activity distribution by hour
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart
                                            data={productivityHours}
                                            margin={{
                                                top: 10,
                                                right: 30,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="colorCount"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#8884d8"
                                                        stopOpacity={0.8}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#8884d8"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="hour" />
                                            <YAxis />
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <Tooltip
                                                formatter={(value) => [
                                                    `${value} tasks`,
                                                    "Tasks",
                                                ]}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#8884d8"
                                                fillOpacity={1}
                                                fill="url(#colorCount)"
                                                name="Task Activity"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {/* Completion Trends - Line Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Completion Rate Trends
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    30-day task completion rate
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart
                                            data={completionTrends}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={(date) =>
                                                    new Date(
                                                        date
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                        }
                                                    )
                                                }
                                            />
                                            <YAxis domain={[0, 100]} />
                                            <Tooltip
                                                labelFormatter={(date) =>
                                                    new Date(
                                                        date
                                                    ).toLocaleDateString()
                                                }
                                                formatter={(value) => [
                                                    `${value}%`,
                                                    "Completion Rate",
                                                ]}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="completion_rate"
                                                stroke="#82ca9d"
                                                activeDot={{ r: 8 }}
                                                strokeWidth={2}
                                                name="Completion Rate"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Weekly Progress Composite Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Weekly Progress Breakdown
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    Tasks created vs completed by day of week
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <ComposedChart
                                            data={weeklyProgress}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value, name) => [
                                                    value,
                                                    name === "total"
                                                        ? "Total Tasks"
                                                        : "Completed Tasks",
                                                ]}
                                            />
                                            <Legend />
                                            <Bar
                                                dataKey="total"
                                                name="Total Tasks"
                                                barSize={30}
                                                fill="#8884d8"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="completed"
                                                name="Completed Tasks"
                                                stroke="#82ca9d"
                                                strokeWidth={2}
                                            />
                                        </ComposedChart>
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
