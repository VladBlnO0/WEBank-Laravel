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
        return ['database', 'mail'];

    }

    public function toMail($notifiable): MailMessage
    {
        $isSender = $this->transaction->fromCard->user_id === $notifiable->id;

        if ($isSender) {
            return (new MailMessage)
                ->subject('Transfer Sent Successfully')
                ->line("You sent \${$this->transaction->amount} from your card ({$this->transaction->fromCard->pan}) to card ({$this->transaction->toCard->pan}).")
                ->action('View Dashboard', route('user.dashboard.index'))
                ->line('Thank you for using our application!');
        }

        return (new MailMessage)
            ->subject('Money Received!')
            ->line("You received \${$this->transaction->amount} on your card ({$this->transaction->toCard->pan}) from card ({$this->transaction->fromCard->pan}).")
            ->action('View Dashboard', route('user.dashboard.index'))
            ->line('Thank you for using our application!');
    }

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
