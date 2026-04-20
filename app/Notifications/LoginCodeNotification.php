<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LoginCodeNotification extends Notification
{
    use Queueable;

    public function __construct(public string $code) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your login code')
            ->greeting('Hello!')
            ->line('Use the code below to finish signing in to your account.')
            ->line('Login code: '.$this->code)
            ->line('This code expires in 10 minutes.')
            ->line('If you did not request this code, you can ignore this email.');
    }
}
