<?php

use App\Models\ServiceProvider;
use App\Models\Card;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_payments', function (Blueprint $table) {
            $table->id();

            $table->decimal('amount', 15, 2)->default(0);
            $table->dateTime('next_date');
            $table->boolean('is_payed');

            $table->foreignIdFor(Card::class)->constrained('cards');
            $table->foreignIdFor(ServiceProvider::class)->constrained('service_providers');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_payments');
    }
};
