<?php

use App\Models\Account;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('regular_payments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('amount');
            $table->dateTime('cron_schedule');
            $table->string('next_execution_date');
            $table->boolean('is_active');
            $table->foreignIdFor(Account::class)->constrained('accounts');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regular_payments');
    }
};
