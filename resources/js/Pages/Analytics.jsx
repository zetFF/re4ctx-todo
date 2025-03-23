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
} from "lucide-react";

export default function Analytics({
    auth,
    stats,
    tasksByCategory,
    tasksByMonth,
    tasksByPriority,
    tasksByStatus,
    taskCompletion,
    productivityHours,
    taskTrends,
}) {
    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#8884d8",
        "#82ca9d",
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Analytics" />

            <div className="py-6">
                <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header with Title and Date */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                Today's Stats
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Quick overview
                            </p>
                        </div>
                        <Badge variant="outline" className="px-4 py-2">
                            Last Updated: {new Date().toLocaleDateString()}
                        </Badge>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card className="bg-pink-50 border-none">
                            <CardContent className="pt-4">
                                <div className="flex justify-between items-start">
                                    <div className="rounded-full bg-pink-100 p-2">
                                        <Clock className="h-4 w-4 text-pink-500" />
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="flex gap-1 items-center"
                                    >
                                        <ArrowUp className="h-3 w-3 text-green-500" />
                                        <span className="text-xs">
                                            +5% from yesterday
                                        </span>
                                    </Badge>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-bold">
                                        {stats.total}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Total Tasks
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-orange-50 border-none">
                            <CardContent className="pt-4">
                                <div className="flex justify-between items-start">
                                    <div className="rounded-full bg-orange-100 p-2">
                                        <AlertCircle className="h-4 w-4 text-orange-500" />
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="flex gap-1 items-center"
                                    >
                                        <ArrowDown className="h-3 w-3 text-red-500" />
                                        <span className="text-xs">
                                            -2% from yesterday
                                        </span>
                                    </Badge>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-bold">
                                        {stats.pending}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Pending Tasks
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-none">
                            <CardContent className="pt-4">
                                <div className="flex justify-between items-start">
                                    <div className="rounded-full bg-green-100 p-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="flex gap-1 items-center"
                                    >
                                        <ArrowUp className="h-3 w-3 text-green-500" />
                                        <span className="text-xs">
                                            +8% from yesterday
                                        </span>
                                    </Badge>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-bold">
                                        {stats.completed}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Completed Tasks
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-purple-50 border-none">
                            <CardContent className="pt-4">
                                <div className="flex justify-between items-start">
                                    <div className="rounded-full bg-purple-100 p-2">
                                        <Users className="h-4 w-4 text-purple-500" />
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="flex gap-1 items-center"
                                    >
                                        <ArrowUp className="h-3 w-3 text-green-500" />
                                        <span className="text-xs">
                                            +12% from yesterday
                                        </span>
                                    </Badge>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-bold">
                                        {stats.active_users || 0}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Active Users
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Total Revenue Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Task Completion Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart data={tasksByMonth}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#eee"
                                            />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                dataKey="completed"
                                                name="Completed Tasks"
                                                fill="#8884d8"
                                            />
                                            <Bar
                                                dataKey="pending"
                                                name="Pending Tasks"
                                                fill="#82ca9d"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Satisfaction Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Task Progress Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart data={taskCompletion}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#eee"
                                            />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="completed"
                                                stroke="#8884d8"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="efficiency"
                                                stroke="#82ca9d"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Top Products List */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Top Categories
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {tasksByCategory
                                        .slice(0, 4)
                                        .map((category, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium">
                                                        {category.name}
                                                    </p>
                                                    <Progress
                                                        value={category.value}
                                                        className="h-1 w-[100px]"
                                                    />
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {category.value}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional charts can be added here */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
