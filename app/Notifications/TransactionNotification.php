<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TransactionNotification extends Notification
{
    public function __construct(
        private Transaction $transaction
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    // public function toMail($notifiable): MailMessage
    // {
    //     return (new MailMessage)->line('Thank you for using our application!');
    // }

    // public function toDatabase($notifiable): array
    // {
    //     return [];
    // }

    public function toArray($notifiable): array
    {
        $isSender = $this->transaction->fromCard->user_id === $notifiable->id;

        if ($isSender) {
            return [
                'transaction_id' => $this->transaction->id,
                'amount' => $this->transaction->amount,
                'from_card_id' => $this->transaction->from_card_id,
                'to_card_id' => $this->transaction->to_card_id,
                'message' => "You sent \${$this->transaction->amount}",

            ];
        }

        return [
            'transaction_id' => $this->transaction->id,
            'amount' => $this->transaction->amount,
            'from_card_id' => $this->transaction->from_card_id,
            'to_card_id' => $this->transaction->to_card_id,
            'message' => "You received \${$this->transaction->amount}",
        ];
    }
}
