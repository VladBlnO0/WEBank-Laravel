<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login')->middleware('guest');
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard')->middleware('auth');
Route::middleware('auth')->group(function () {
    Route::get('/user-dashboard', [App\Http\Controllers\UserDashboardController::class, 'index'])->name('user-dashboard');
    Route::get('/user-transfer', [App\Http\Controllers\UserTransferController::class, 'show'])->name('user-transfer');
    Route::get('/user-services', [App\Http\Controllers\UserServicesController::class, 'show'])->name('user-services');

    Route::get('/faq', function () {
        return Inertia::render('FAQ');
    })->name('faq');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
