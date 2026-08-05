<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('procedures')
            ->whereNotNull('cnpj')
            ->where('cnpj', '!=', '')
            ->orderBy('id')
            ->chunkById(100, function ($rows) {
                foreach ($rows as $row) {
                    $digits = preg_replace('/\D/', '', $row->cnpj);

                    DB::table('procedures')
                        ->where('id', $row->id)
                        ->update(['cnpj' => $digits !== '' ? $digits : null]);
                }
            });
    }

    public function down(): void
    {
        //
    }
};