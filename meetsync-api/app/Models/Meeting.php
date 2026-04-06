<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'organizer_id', 'title', 'description',
        'start_at', 'duration_minutes',
        'location', 'reminder_minutes',
    ];

    protected $casts = [
        'start_at' => 'datetime',
    ];

    // La réunion appartient à un organisateur
    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    // Une réunion a plusieurs invitations
    public function invitations()
    {
        return $this->hasMany(Invitation::class);
    }
}