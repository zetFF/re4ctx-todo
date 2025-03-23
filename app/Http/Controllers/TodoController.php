<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TodoController extends Controller
{
    public function index()
    {
        $todos = Todo::with('category')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        $stats = [
            'total' => $todos->count(),
            'completed' => $todos->where('status', 'completed')->count(),
            'pending' => $todos->where('status', 'pending')->count(),
        ];

        $categories = Category::all();

        return Inertia::render('Dashboard', [
            'todos' => $todos,
            'categories' => $categories,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:high,medium,low',
            'category_id' => 'required|exists:categories,id',
            'due_date' => 'required|date',
            'due_time' => 'required',
            'reminder' => 'boolean',
        ]);

        $todo = Todo::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Task created successfully!');
    }

    public function toggleStatus(Todo $todo)
    {
        $todo->update([
            'status' => $todo->status === 'completed' ? 'pending' : 'completed'
        ]);
        
        return redirect()->back();
    }

    public function destroy(Todo $todo)
    {
        // Optional: Add authorization check
        if ($todo->user_id !== auth()->id()) {
            abort(403);
        }

        $todo->delete();
        
        return redirect()->back()->with('success', 'Task deleted successfully');
    }

    public function complete(Todo $todo)
    {
        $todo->update([
            'status' => $todo->status === 'completed' ? 'pending' : 'completed',
            'completed_at' => $todo->status === 'completed' ? null : now(),
            'updated_at' => now()
        ]);

        return back();
    }

    public function update(Request $request, Todo $todo)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'category_id' => 'nullable|exists:categories,id',
            'due_date' => 'required|date',
            'due_time' => 'required',
            'reminder' => 'boolean',
        ]);

        $todo->update($validated);

        return redirect()->back()->with('success', 'Task updated successfully');
    }

    public function analytics()
    {
        $stats = [
            'total' => Todo::count(),
            'completed' => Todo::where('status', 'completed')->count(),
            'pending' => Todo::where('status', 'pending')->count(),
            'overdue' => Todo::where('due_date', '<', now())->where('status', 'pending')->count(),
            'newTasks' => Todo::where('created_at', '>=', now()->subWeek())->count(),
            'completionRate' => 85, // Calculate based on your business logic
        ];

        $tasksByCategory = Category::withCount('todos')
            ->get()
            ->map(fn($category) => [
                'name' => $category->name,
                'value' => $category->todos_count
            ]);

        $tasksByMonth = Todo::selectRaw('
            DATE_FORMAT(created_at, "%Y-%m") as month,
            COUNT(CASE WHEN status = "completed" THEN 1 END) as completed,
            COUNT(CASE WHEN status = "pending" THEN 1 END) as pending
        ')
        ->groupBy('month')
        ->get();

        $tasksByPriority = Todo::selectRaw('
            priority as name,
            COUNT(*) as value
        ')
        ->groupBy('priority')
        ->get();

        // Task Completion Rate
        $taskCompletion = Todo::selectRaw('
            DATE(created_at) as date,
            COUNT(CASE WHEN status = "completed" THEN 1 END) as completed,
            COUNT(CASE WHEN status = "pending" THEN 1 END) as pending
        ')
        ->groupBy('date')
        ->get();

        // Productivity Hours
        $productivityHours = Todo::selectRaw('
            HOUR(created_at) as hour,
            COUNT(*) as completed
        ')
        ->where('status', 'completed')
        ->groupBy('hour')
        ->get();

        // Task Trends
        $taskTrends = Todo::selectRaw('
            DATE_FORMAT(created_at, "%Y-%m") as name,
            COUNT(*) as total,
            AVG(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as average,
            COUNT(CASE WHEN status = "completed" THEN 1 END) as completed
        ')
        ->groupBy('name')
        ->get();

        // Task Distribution
        $tasksByStatus = Todo::select('duration', 'priority', 'status')
            ->get()
            ->map(function ($task) {
                return [
                    'duration' => $task->duration,
                    'priority' => $task->priority,
                    'status' => $task->status
                ];
            });

        // Calculate efficiency score
        $stats['efficiency'] = Todo::where('status', 'completed')
            ->where('completed_at', '<=', 'due_date')
            ->count() / max(Todo::count(), 1) * 100;

        // Calculate streak
        $stats['streak'] = Todo::selectRaw('
            COUNT(DISTINCT DATE(completed_at)) as streak_days
        ')
        ->where('status', 'completed')
        ->where('completed_at', '>=', function($query) {
            $query->selectRaw('MAX(date) as last_incomplete_date')
                ->from(function($subquery) {
                    $subquery->selectRaw('
                        DATE(completed_at) as date,
                        COUNT(*) as completed_count,
                        (SELECT COUNT(*) FROM todos WHERE DATE(created_at) = DATE(t1.completed_at)) as total_count
                    ')
                    ->from('todos as t1')
                    ->where('status', 'completed')
                    ->groupBy('date')
                    ->having('completed_count', '<', 'total_count');
                }, 'incomplete_dates');
        })
        ->value('streak_days');

        return Inertia::render('Analytics', compact(
            'stats',
            'tasksByCategory',
            'tasksByMonth',
            'tasksByPriority',
            'taskCompletion',
            'productivityHours',
            'taskTrends',
            'tasksByStatus'
        ));
    }

    public function upcoming()
    {
        $upcomingTasks = Todo::where('due_date', '>=', now())
            ->where('status', 'pending')
            ->orderBy('due_date')
            ->orderBy('due_time')
            ->with('category')
            ->get();

        return Inertia::render('Upcoming', compact('upcomingTasks'));
    }

    // Tambahkan method lain untuk CRUD
} 