<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('procedures');

        Schema::create('procedures', function (Blueprint $table) {
            $table->id();
            $table->string('provider', 150);
            $table->string('code', 50);
            $table->text('description');
            $table->string('deadline_ambulatory', 50);
            $table->date('deadline_urgency')->nullable();
            $table->string('deadline_hospitalization', 100);
            $table->boolean('requires_justification')->default(false);
            $table->boolean('authorization_coopanest')->default(true);
            $table->json('operational_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('procedures');
    }
};
