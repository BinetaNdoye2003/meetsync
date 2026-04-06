<?php

namespace App\Console;

use App\Mail\ReminderMail;
use App\Models\Meeting;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Mail;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        $schedule->call(function () {

            // Cherche les réunions qui commencent dans 14-16 minutes
            $meetings = Meeting::query()
                ->whereBetween('start_at', [
                    now()->addMinutes(14),
                    now()->addMinutes(16),
                ])
                ->with([
                    'invitations' => fn($q) =>
                        $q->where('status', 'accepted')->with('user'),
                    'organizer',
                ])
                ->get();

            foreach ($meetings as $meeting) {
                // Envoyer rappel à l'organisateur
                Mail::to($meeting->organizer->email)
                    ->send(new ReminderMail($meeting));

                // Envoyer rappel aux participants
                foreach ($meeting->invitations as $invitation) {
                    Mail::to($invitation->user->email)
                        ->send(new ReminderMail($meeting));
                }
            }

        })
        ->name('send_meeting_reminders') // ✅ AJOUT IMPORTANT
        ->everyMinute()
        ->withoutOverlapping();
    }

    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');
        require base_path('routes/console.php');
    }
}