<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nombre',
        'apellido',
        'nombre_usuario',
        'email',
        'password',
        'ultima_conexion',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

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
            'two_factor_confirmed_at' => 'datetime',
            'ultima_conexion' => 'datetime',
        ];
    }

    public function avatar(): string
    {
        return 'https://ui-avatars.com/api/?name='.urlencode($this->nombre_usuario);
    }

    public function getNombreUsuario(): string
    {
        return $this->nombre_usuario;
    }

    public function getNombreCompleto(): string
    {
        return $this->nombre.' '.$this->apellido;
    }

    protected function getId(): int
    {
        return $this->id;
    }

    public function conversacionesEnviadas(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Conversacion::class, 'id_emisor');
    }

    public function conversacionesRecibidas(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Conversacion::class, 'id_receptor');
    }
}
