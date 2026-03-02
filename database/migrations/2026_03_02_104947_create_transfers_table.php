<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(App\Models\Transaction::class, 'transaction_id')->constrained('transactions')->cascadeOnDelete();
            // $table->foreignIdFor(App\Models\User::class, 'user_id')->constrained('users');

            $table->string('receiver_iban', 34);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
