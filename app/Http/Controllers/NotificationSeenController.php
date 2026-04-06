<?php

namespace App\Http\Controllers;

use Gate;
use Illuminate\Notifications\DatabaseNotification;

class NotificationSeenController extends Controller
{
    public function __invoke(DatabaseNotification $notification)
    {
        Gate::authorize('update', $notification);
        $notification->markAsRead();

        return redirect()->back()
            ->with('status', 'Notification marked as read');
    }
}
