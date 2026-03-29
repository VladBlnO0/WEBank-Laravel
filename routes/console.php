<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// use Illuminate\Support\Facades\Schedule;
// use App\Models\User;

// Schedule::call(function () {
//     // Example: Deactivate users who haven't logged in for 30 days
//     User::where('last_login', '<', now()->subDays(30))
//         ->update(['status' => 'inactive']);
// })->daily(); // Runs daily at midnight [1, 5]
