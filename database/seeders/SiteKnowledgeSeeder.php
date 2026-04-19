<?php

namespace Database\Seeders;

use App\Models\SiteKnowledge;
use Illuminate\Database\Seeder;

class SiteKnowledgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SiteKnowledge::query()->delete();

        SiteKnowledge::create([
            'content' => 'To change your password, click on your profile settings and select the password change option in the account security section.',
        ]);

        SiteKnowledge::create([
            'content' => 'To transfer money, you need to select the source card, enter the recipient information, specify the amount, and confirm the transfer.',
        ]);

        SiteKnowledge::create([
            'content' => 'Your dashboard displays all your cards, recent transactions, and account summary information in one place.',
        ]);

        SiteKnowledge::create([
            'content' => 'Notifications show all your account alerts, transaction updates, and important messages related to your account activity.',
        ]);

        SiteKnowledge::create([
            'content' => 'Your profile contains your personal information, email address, password settings, and account preferences.',
        ]);

        SiteKnowledge::create([
            'content' => 'You can export transaction history as CSV to download and analyze your transaction records.',
        ]);
    }
}
