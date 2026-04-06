@component('mail::message')
# Vous êtes invité à une réunion

Bonjour **{{ $invitation->user->name }}**,

**{{ $meeting->organizer->name }}** vous invite à la réunion suivante :

| | |
|---|---|
| **Titre** | {{ $meeting->title }} |
| **Date** | {{ \Carbon\Carbon::parse($meeting->start_at)->format('d/m/Y à H:i') }} |
| **Durée** | {{ $meeting->duration_minutes }} minutes |
| **Lieu** | {{ $meeting->location ?? 'Non précisé' }} |

@component('mail::button', ['url' => $acceptUrl, 'color' => 'success'])
✓ Accepter
@endcomponent

@component('mail::button', ['url' => $refuseUrl, 'color' => 'error'])
✗ Refuser
@endcomponent

Merci,
**L'équipe MeetSync**
@endcomponent