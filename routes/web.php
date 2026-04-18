<?php

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\NotificationSeenController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\UserTransactionExportController;
use App\Http\Controllers\UserTransferController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('user.dashboard.index')
        : redirect()->route('login');
});

Route::resource('notification', NotificationController::class)
    ->middleware('auth')
    ->only(['index']);
Route::put(
    'notification/{notification}/seen',
    NotificationSeenController::class
)->middleware('auth')->name('notification.seen');

Route::prefix('user')
    ->name('user.')
    ->middleware(['auth', 'verified'])
    ->group(function () {
        Route::resource('dashboard', UserDashboardController::class)->middleware('auth');
        Route::resource('transfer', UserTransferController::class)->middleware('auth');
        Route::get('transactions/export', UserTransactionExportController::class)
            ->middleware('throttle:1,5')
            ->name('transactions.export');
    });

Route::middleware('auth')->group(function () {
    // Route::get('cards/{card}/transactions', [TransactionController::class, 'index'])->name('cards.transactions');

    // Profile routes
});
Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

Route::get('/email/verify', function () {
    return inertia('auth/verify-email');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect()->route('user.dashboard.index')
        ->with('status', 'Email was verified!');
})->middleware(['auth', 'signed'])->name('verification.verify');

// Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
//     $request->fulfill();
// });

require __DIR__.'/auth.php';
