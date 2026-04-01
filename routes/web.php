<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AiOperatorController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\UserTransferController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('Welcome');
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login')->middleware('guest');

Route::middleware('auth')->group(function () {
    Route::get('/user-dashboard', [UserDashboardController::class, 'index'])->name('user-dashboard');
    Route::get('/user-transfer', [UserTransferController::class, 'index'])->name('user-transfer');
    
    Route::post('/ai/operator/chat', [AiOperatorController::class, 'chat'])
        ->middleware('throttle:30,1')
        ->name('ai.operator.chat');

    Route::get('/faq', function () {
        return Inertia::render('FAQ');
    })->name('faq');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
