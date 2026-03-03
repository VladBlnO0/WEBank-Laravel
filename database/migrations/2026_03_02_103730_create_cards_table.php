<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class, 'user_id')->constrained('users');

            $table->string('pan', 10);
            $table->string('cvv', 3);
            $table->string('pin_hash', 64);
            $table->date('expire_date');
            $table->string('type', 10);
            $table->string('status', 10);

            // balance with 15 digits in total and 2 decimal places
            $table->decimal('balance', 15, 2);
            $table->decimal('limit_amount', 15, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
