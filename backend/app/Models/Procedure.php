<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Procedure extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider',
        'cnpj',
        'code',
        'code_to_authorize',
        'description',
        'deadline_ambulatory',
        'deadline_hospitalization',
        'requires_justification',
        'authorization_coopanest',
        'operational_notes',
    ];

    protected function casts(): array
    {
        return [
            'requires_justification' => 'boolean',
            'authorization_coopanest' => 'boolean',
            'operational_notes' => 'array',
        ];
    }

    public function toSearchResult(): array
    {
        return [
            'id' => $this->id,
            'provider' => $this->provider,
            'cnpj' => $this->cnpj,
            'code' => $this->code,
            'code_to_authorize' => $this->code_to_authorize,
            'description' => $this->description,
            'deadlines' => [
                'ambulatory' => $this->deadline_ambulatory,
                'hospitalization' => $this->deadline_hospitalization,
            ],
            'requires_justification' => $this->requires_justification,
            'authorization_coopanest' => $this->authorization_coopanest,
            'operational_notes' => $this->operational_notes ?? [],
        ];
    }
}
