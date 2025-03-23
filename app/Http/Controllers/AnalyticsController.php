<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        return Inertia::render('Analytics', [
            'stats' => $this->getStats($userId),
            'tasksByCategory' => $this->getTasksByCategory($userId),
            'tasksByMonth' => $this->getTasksByMonth($userId),
            'tasksByPriority' => $this->getTasksByPriority($userId),
            'taskCompletion' => $this->getTaskCompletion($userId),
            'weeklyProgress' => $this->getWeeklyProgress($userId),
            'productivityHours' => $this->getProductivityHours($userId),
            'completionTrends' => $this->getCompletionTrends($userId),
        ]);
    }

    private function getStats($userId)
    {
        $totalTasks = Todo::where('user_id', $userId)->count();
        $completedTasks = Todo::where('user_id', $userId)
            ->where('status', 'completed')
            ->count();

        return [
            'total' => $totalTasks ?: 1, // Menghindari pembagian dengan 0
            'completed' => $completedTasks,
            'pending' => Todo::where('user_id', $userId)
                ->where('status', 'pending')
                ->count(),
            'overdue' => Todo::where('user_id', $userId)
                ->where('due_date', '<', now())
                ->where('status', 'pending')
                ->count(),
        ];
    }

    private function getTasksByCategory($userId)
    {
        return Category::withCount(['todos' => function($query) use ($userId) {
            $query->where('user_id', $userId);
        }])
        ->get()
        ->map(function($category) {
            return [
                'name' => $category->name,
                'value' => $category->todos_count,
            ];
        })
        ->values(); // Mengubah collection menjadi array
    }

    private function getTasksByMonth($userId)
    {
        $sixMonthsAgo = now()->subMonths(6)->startOfMonth();
        
        return Todo::where('user_id', $userId)
            ->where('created_at', '>=', $sixMonthsAgo)
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as name'),
                DB::raw('COUNT(CASE WHEN status = "completed" THEN 1 END) as completed'),
                DB::raw('COUNT(CASE WHEN status = "pending" THEN 1 END) as pending')
            )
            ->groupBy('name')
            ->orderBy('name')
            ->get()
            ->map(function($item) {
                return [
                    'name' => Carbon::createFromFormat('Y-m', $item->name)->format('M Y'),
                    'completed' => (int)$item->completed,
                    'pending' => (int)$item->pending,
                ];
            });
    }

    private function getTasksByPriority($userId)
    {
        return Todo::where('user_id', $userId)
            ->select('priority as name', DB::raw('COUNT(*) as value'))
            ->groupBy('priority')
            ->get()
            ->map(function($item) {
                return [
                    'name' => ucfirst($item->name),
                    'value' => (int)$item->value,
                ];
            });
    }

    private function getTaskCompletion($userId)
    {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return collect($days)->map(function($day) use ($userId) {
            return [
                'subject' => substr($day, 0, 3),
                'A' => rand(60, 100), // Sementara menggunakan data random
                'B' => 100,
            ];
        })->values();
    }

    private function getWeeklyProgress($userId)
    {
        $lastWeek = now()->subWeek()->startOfWeek();
        
        return Todo::where('user_id', $userId)
            ->where('created_at', '>=', $lastWeek)
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%a") as day'),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed')
            )
            ->groupBy('day')
            ->get()
            ->map(function($item) {
                return [
                    'day' => $item->day,
                    'total' => (int)$item->total,
                    'completed' => (int)$item->completed,
                ];
            });
    }

    private function getProductivityHours($userId)
    {
        $hours = range(0, 23);
        return collect($hours)->map(function($hour) {
            return [
                'hour' => sprintf('%02d:00', $hour),
                'count' => rand(1, 10), // Sementara menggunakan data random
            ];
        });
    }

    private function getCompletionTrends($userId)
    {
        $thirtyDaysAgo = now()->subDays(30)->startOfDay();
        
        return Todo::where('user_id', $userId)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function($item) {
                return [
                    'date' => $item->date,
                    'completion_rate' => $item->total > 0 
                        ? round(($item->completed / $item->total) * 100, 1)
                        : 0,
                ];
            });
    }
} 