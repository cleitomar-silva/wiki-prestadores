<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('procedures', function (Blueprint $table) {
            if (Schema::hasIndex('procedures', ['code'])) {
                $table->dropUnique(['code']);
            }
            if (Schema::hasIndex('procedures', ['code_to_authorize'])) {
                $table->dropUnique(['code_to_authorize']);
            }
        });
    }

    public function down(): void
    {
        Schema::table('procedures', function (Blueprint $table) {
            if (!Schema::hasIndex('procedures', ['code'])) {
                $table->unique('code');
            }
            if (!Schema::hasIndex('procedures', ['code_to_authorize'])) {
                $table->unique('code_to_authorize');
            }
        });
    }
};