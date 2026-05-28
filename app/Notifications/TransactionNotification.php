<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class TransactionNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private Transaction $transaction
    ) {}

    public function via($notifiable): array
    {
        return ['database', 'mail'];

    }

    private function lastFour(string $cardNumber): string
    {
        return Str::of($cardNumber)->replaceMatches('/\s+/', '')->substr(-4)->toString();
    }

    public function toMail($notifiable): MailMessage
    {
        $isSender = $this->transaction->fromCard->user_id === $notifiable->id;
        $fromCardLast4 = $this->lastFour($this->transaction->fromCard->pan);
        $toCardLast4 = $this->lastFour($this->transaction->toCard->pan);

        if ($isSender) {
            return (new MailMessage)
                ->subject('Transfer Sent Successfully')
                ->line("You sent \${$this->transaction->amount} from card **** $fromCardLast4 to card **** $toCardLast4.")
                ->action('View Dashboard', route('user.dashboard.index'))
                ->line('Thank you for using our application!');
        }

        return (new MailMessage)
            ->subject('Money Received!')
            ->line("You received \${$this->transaction->amount} on card **** $toCardLast4 from card **** $fromCardLast4.")
            ->action('View Dashboard', route('user.dashboard.index'))
            ->line('Thank you for using our application!');
    }

    public function toArray($notifiable): array
    {
        $isSender = $this->transaction->fromCard->user_id === $notifiable->id;
        $fromCardLast4 = $this->lastFour($this->transaction->fromCard->pan);
        $toCardLast4 = $this->lastFour($this->transaction->toCard->pan);
        $message = $isSender
            ? "You sent \${$this->transaction->amount} from card **** $fromCardLast4 to card **** $toCardLast4."
            : "You received \${$this->transaction->amount} on card **** $toCardLast4 from card **** $fromCardLast4.";

        return [
            'transaction_id' => $this->transaction->id,
            'amount' => $this->transaction->amount,
            'from_card_id' => $this->transaction->from_card_id,
            'to_card_id' => $this->transaction->to_card_id,
            'from_card_last4' => $fromCardLast4,
            'to_card_last4' => $toCardLast4,
            'message' => $message,
        ];
    }
}
