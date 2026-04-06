<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMeetingRequest;
use App\Models\Meeting;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    // ── Lister toutes les réunions de l'utilisateur ──
    public function index(Request $request)
    {
        $user = $request->user();

        // Réunions organisées par l'user
        $organized = Meeting::where('organizer_id', $user->id)
            ->with('organizer')
            ->withCount([
                'invitations',
                'invitations as accepted_count' => fn($q) =>
                    $q->where('status', 'accepted'),
            ])
            ->orderBy('start_at')
            ->get();

        // Réunions où l'user est invité
        $invited = Meeting::whereHas('invitations', fn($q) =>
            $q->where('user_id', $user->id)
        )
            ->with(['organizer', 'invitations' => fn($q) =>
                $q->where('user_id', $user->id)
            ])
            ->orderBy('start_at')
            ->get();

        return response()->json([
            'organized' => $organized,
            'invited'   => $invited,
        ]);
    }

    // ── Créer une réunion ────────────────────────────
   public function store(StoreMeetingRequest $request)
{
    $user = $request->user();

    // Vérifier l'anti-chevauchement
    $startAt = \Carbon\Carbon::parse($request->start_at);
    $endAt   = $startAt->copy()->addMinutes($request->duration_minutes);

    $overlap = Meeting::where('organizer_id', $user->id)
        ->where(function ($q) use ($startAt, $endAt) {
            $q->whereBetween('start_at', [$startAt, $endAt])
              ->orWhereRaw(
                '? BETWEEN start_at AND DATE_ADD(start_at, INTERVAL duration_minutes MINUTE)',
                [$startAt]
              );
        })->exists();

    if ($overlap) {
        return response()->json([
            'message' => 'Vous avez déjà une réunion sur ce créneau.'
        ], 422);
    }

    // Créer la réunion
    $meeting = Meeting::create([
        'organizer_id'     => $user->id,
        'title'            => $request->title,
        'description'      => $request->description,
        'start_at'         => $request->start_at,
        'duration_minutes' => $request->duration_minutes,
        'location'         => $request->location,
        'reminder_minutes' => $request->reminder_minutes ?? 15,
    ]);

    // Créer les invitations et envoyer les emails
    if ($request->has('participant_ids') && count($request->participant_ids) > 0) {
        $meeting->load('organizer');
        foreach ($request->participant_ids as $userId) {
            $invitation = \App\Models\Invitation::create([
                'meeting_id' => $meeting->id,
                'user_id'    => $userId,
                'status'     => 'pending',
            ]);
            $invitation->load('user');
            \Illuminate\Support\Facades\Mail::to($invitation->user->email)
                ->send(new \App\Mail\InvitationMail($meeting, $invitation));
        }
    }

    return response()->json(
        $meeting->load(['organizer', 'invitations.user']),
        201
    );
}


    
public function upcoming(Request $request)
{
    $user = $request->user();

    // Réunions organisées dans les prochaines 24h
    $organized = Meeting::where('organizer_id', $user->id)
        ->whereBetween('start_at', [now(), now()->addHours(24)])
        ->orderBy('start_at')
        ->get();

    // Réunions invitées dans les prochaines 24h
    $invited = Meeting::whereHas('invitations', fn($q) =>
        $q->where('user_id', $user->id)
          ->where('status', 'accepted')
    )
        ->whereBetween('start_at', [now(), now()->addHours(24)])
        ->orderBy('start_at')
        ->get();

    return response()->json([
        'organized' => $organized,
        'invited'   => $invited,
    ]);
}

    // ── Voir une réunion ─────────────────────────────
    public function show(Meeting $meeting)
    {
        $this->authorize('view', $meeting);
        return response()->json(
            $meeting->load(['organizer', 'invitations.user'])
        );
    }

    // ── Supprimer une réunion ────────────────────────
    public function destroy(Request $request, Meeting $meeting)
    {
        if ($meeting->organizer_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Seul l\'organisateur peut supprimer cette réunion.'
            ], 403);
        }

        $meeting->delete();
        return response()->json(['message' => 'Réunion supprimée.']);
    }
}