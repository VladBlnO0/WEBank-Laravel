<?php

use App\Http\Controllers\AiOperatorController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\NotificationSeenController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\UserTransferController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('dashboard.index')
        : redirect()->route('login');
});

Route::resource('notification', NotificationController::class)
    ->middleware('auth')
    ->only(['index']);
Route::put(
    'notification/{notification}/seen',
    NotificationSeenController::class
)->middleware('auth')->name('notification.seen');

Route::middleware('auth')->group(function () {
    Route::resource('dashboard', UserDashboardController::class)->only(['index']);
    Route::resource('transfer', UserTransferController::class)->only(['index', 'store']);

    // Route::post('/ai/operator/chat', [AiOperatorController::class, 'chat'])
    //     ->middleware('throttle:30,1')
    //     ->name('ai.operator.chat');
    // Route::get('cards/{card}/transactions', [TransactionController::class, 'index'])->name('cards.transactions');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});

require __DIR__.'/auth.php';
