<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('procedures', function (Blueprint $table) {
            $table->id();
            $table->string('provider');
            $table->string('code');
            $table->text('description');
            $table->string('deadline_ambulatory');
            $table->string('deadline_urgency');
            $table->string('deadline_hospitalization');
            $table->json('operational_notes');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('procedures');
    }
};
