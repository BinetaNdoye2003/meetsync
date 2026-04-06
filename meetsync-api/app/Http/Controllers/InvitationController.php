<?php

namespace App\Http\Controllers;

use App\Mail\InvitationMail;
use App\Models\Invitation;
use App\Models\Meeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class InvitationController extends Controller
{
    // ── Inviter des participants à une réunion ───────
    public function store(Request $request, Meeting $meeting)
    {
        // Seul l'organisateur peut inviter
        if ($meeting->organizer_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Non autorisé.'
            ], 403);
        }

        $request->validate([
            'participant_ids'   => ['required', 'array'],
            'participant_ids.*'  => ['exists:users,id'],
        ]);

        $created = [];

        foreach ($request->participant_ids as $userId) {
            // Éviter les doublons
            $existing = Invitation::where('meeting_id', $meeting->id)
                ->where('user_id', $userId)
                ->first();

            if ($existing) continue;

            $invitation = Invitation::create([
                'meeting_id' => $meeting->id,
                'user_id'    => $userId,
                'status'     => 'pending',
            ]);

            $invitation->load('user');

            // Envoyer l'email d'invitation
            Mail::to($invitation->user->email)
                ->send(new InvitationMail($meeting, $invitation));

            $created[] = $invitation;
        }

        return response()->json([
            'message'     => count($created) . ' invitation(s) envoyée(s).',
            'invitations' => $created,
        ], 201);
    }

    // ── Répondre à une invitation (accepter/refuser) ─
    public function update(Request $request, Invitation $invitation)
    {
        // Seul l'invité peut répondre
        if ($invitation->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Non autorisé.'
            ], 403);
        }

        $request->validate([
            'status' => ['required', 'in:accepted,refused'],
        ]);

        $invitation->update([
            'status'       => $request->status,
            'responded_at' => now(),
        ]);

        return response()->json($invitation->load(['meeting', 'user']));
    }

    // ── Répondre via lien email (GET) ─────────────────
    public function acceptViaLink(Invitation $invitation)
    {
        $invitation->update([
            'status'       => 'accepted',
            'responded_at' => now(),
        ]);
        return response()->json(['message' => 'Invitation acceptée ✓']);
    }

    public function refuseViaLink(Invitation $invitation)
    {
        $invitation->update([
            'status'       => 'refused',
            'responded_at' => now(),
        ]);
        return response()->json(['message' => 'Invitation refusée.']);
    }
}