<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('procedures', 'cnpj')) {
            Schema::table('procedures', function (Blueprint $table) {
                $table->string('cnpj', 20)->nullable()->after('provider');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('procedures', 'cnpj')) {
            Schema::table('procedures', function (Blueprint $table) {
                $table->dropColumn('cnpj');
            });
        }
    }
};