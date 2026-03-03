<?php

use App\Models\ServiceProvider;
use App\Models\Transaction;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('service_payments', function (Blueprint $table) {
            $table->id();
            $table->integer('meter_reading');
            $table->foreignIdFor(Transaction::class)->constrained('transactions');
            $table->foreignIdFor(ServiceProvider::class)->constrained('service_providers');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_payments');
    }
};
