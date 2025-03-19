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
        $todo->delete();
        
        return redirect()->back();
    }

    public function complete(Todo $todo)
    {
        $todo->update([
            'status' => $todo->status === 'completed' ? 'in_progress' : 'completed',
            'updated_at' => now()
        ]);

        return back();
    }

    // Tambahkan method lain untuk CRUD
} 