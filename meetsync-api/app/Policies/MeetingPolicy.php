<?php

namespace App\Policies;

use App\Models\Meeting;
use App\Models\User;

class MeetingPolicy
{
    // Peut voir si organisateur OU invité
    public function view(User $user, Meeting $meeting): bool
    {
        $isInvited = $meeting->invitations()
            ->where('user_id', $user->id)
            ->exists();

        return $meeting->organizer_id === $user->id || $isInvited;
    }

    // Peut modifier/supprimer seulement l'organisateur
    public function update(User $user, Meeting $meeting): bool
    {
        return $meeting->organizer_id === $user->id;
    }

    public function delete(User $user, Meeting $meeting): bool
    {
        return $meeting->organizer_id === $user->id;
    }
}