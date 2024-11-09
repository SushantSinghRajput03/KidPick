<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/students', [StudentController::class, 'index'])->name('student.index');
    Route::get('/add-student', [StudentController::class, 'create'])->name('student.create');
    Route::post('/add-student', [StudentController::class, 'store'])->name('student.store');
    Route::delete('/student/{id}', [StudentController::class, 'destroy'])->name('student.destroy');
    Route::get('/view-student/{id}', [StudentController::class, 'show'])->name('student.show');
    Route::get('/edit-student/{id}', [StudentController::class, 'edit'])->name('student.edit');
    Route::post('/edit-student/{id}', [StudentController::class, 'update'])->name('student.update');
});

require __DIR__.'/auth.php';
