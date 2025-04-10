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

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240', // max 10MB
        ]);

        try {
            $file = $request->file('file');
            $path = $file->getRealPath();
            
            // Read CSV file
            $csvData = array_map('str_getcsv', file($path));
            $headers = array_shift($csvData); // Remove and get headers
            
            // Validate headers
            $requiredHeaders = ['title', 'description', 'priority', 'category_id', 'due_date', 'due_time'];
            $headerDiff = array_diff($requiredHeaders, $headers);
            if (!empty($headerDiff)) {
                return redirect()->back()->withErrors(['file' => 'CSV file is missing required columns: ' . implode(', ', $headerDiff)]);
            }

            // Get valid category IDs
            $validCategoryIds = Category::pluck('id')->toArray();
            
            $todos = [];
            $user_id = auth()->id();
            $now = now();
            $errors = [];
            $row = 1;
            
            foreach ($csvData as $rowData) {
                $row++;
                if (count($rowData) >= 6) {
                    // Validate priority
                    if (!in_array($rowData[2], ['high', 'medium', 'low'])) {
                        $errors[] = "Row {$row}: Invalid priority value. Must be 'high', 'medium', or 'low'.";
                        continue;
                    }

                    // Validate category_id
                    if (!in_array((int)$rowData[3], $validCategoryIds)) {
                        $errors[] = "Row {$row}: Invalid category_id. Category does not exist.";
                        continue;
                    }

                    // Validate date format
                    if (!strtotime($rowData[4])) {
                        $errors[] = "Row {$row}: Invalid date format. Use YYYY-MM-DD format.";
                        continue;
                    }

                    // Validate time format
                    if (!preg_match("/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/", $rowData[5])) {
                        $errors[] = "Row {$row}: Invalid time format. Use HH:MM format (24-hour).";
                        continue;
                    }

                    $todos[] = [
                        'user_id' => $user_id,
                        'title' => $rowData[0],
                        'description' => $rowData[1],
                        'priority' => $rowData[2],
                        'category_id' => (int)$rowData[3],
                        'due_date' => $rowData[4],
                        'due_time' => $rowData[5],
                        'status' => 'pending',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                } else {
                    $errors[] = "Row {$row}: Insufficient columns.";
                }
            }
            
            if (!empty($errors)) {
                return redirect()->back()->withErrors(['file' => implode("\n", $errors)]);
            }

            // Bulk insert if we have valid todos
            if (!empty($todos)) {
                Todo::insert($todos);
                return redirect()->back()->with('success', count($todos) . ' tasks imported successfully');
            }

            return redirect()->back()->withErrors(['file' => 'No valid data found in the CSV file.']);

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['file' => 'Error processing file: ' . $e->getMessage()]);
        }
    }

    // Tambahkan method lain untuk CRUD
} 