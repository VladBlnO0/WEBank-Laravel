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
        Schema::create('site_knowledge', function (Blueprint $table) {
            $table->id();
            $table->text('content');

            // The vector column (stores the "math" version of the text)
            // 1536 is the standard for OpenAI embeddings
            $table->vector('embedding', 1536);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_knowledge');
    }
};
