@component('mail::message')
# Rappel — Réunion dans 15 minutes !

Votre réunion **{{ $meeting->title }}** commence dans **15 minutes**.

| | |
|---|---|
| **Date** | {{ \Carbon\Carbon::parse($meeting->start_at)->format('d/m/Y à H:i') }} |
| **Durée** | {{ $meeting->duration_minutes }} minutes |
| **Lieu** | {{ $meeting->location ?? 'Non précisé' }} |

@if($meeting->description)
**Description :** {{ $meeting->description }}
@endif

Bonne réunion !

**L'équipe MeetSync**
@endcomponent