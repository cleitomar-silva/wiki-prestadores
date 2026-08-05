<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Intencionalmente vazio: o código autorizado não é mais único.
    }

    public function down(): void
    {
        Schema::table('procedures', function (Blueprint $table) {
            $table->unique('code_to_authorize');
        });
    }
};
