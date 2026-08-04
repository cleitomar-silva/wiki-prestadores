<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role', 'is_active'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public const ROLE_ADMIN = 'administrador';
    public const ROLE_GESTOR = 'gestor';
    public const ROLE_COLABORADOR = 'colaborador';

    public const ROLES = [
        self::ROLE_ADMIN,
        self::ROLE_GESTOR,
        self::ROLE_COLABORADOR,
    ];

    public function effectiveRole(): string
    {
        $role = strtolower(trim((string) $this->role));

        if (in_array($role, ['administrador', 'admin'], true)) {
            return self::ROLE_ADMIN;
        }

        if (in_array($role, ['gestor', 'agente master'], true)) {
            return self::ROLE_GESTOR;
        }

        return self::ROLE_COLABORADOR;
    }
}
