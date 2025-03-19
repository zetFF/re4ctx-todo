<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'todos' => Todo::with('category')->get(),
            'categories' => Category::all(),
            'stats' => [
                'total' => Todo::count(),
                'completed' => Todo::where('status', 'completed')->count(),
                'pending' => Todo::where('status', 'in_progress')->count(),
            ],
        ]);
    }
} 