<?php

namespace Database\Seeders;

use App\Models\Invitation;
use App\Models\Meeting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── UTILISATEURS ─────────────────────────
        $users = collect([
            [
                'name' => 'Fama Ndoye',
                'email' => 'nbineta2003@gmail.com',
            ],
            [
                'name' => 'Maguette Ndiaye',
                'email' => 'maguette@meetsync.app',
            ],
            [
                'name' => 'Papi Diop',
                'email' => 'papi@meetsync.app',
            ],
            [
                'name' => 'Awa Ba',
                'email' => 'awa@meetsync.app',
            ],
            [
                'name' => 'Cheikh Fall',
                'email' => 'cheikh@meetsync.app',
            ],
        ])->map(function ($u) {
            return User::create(array_merge($u, [
                'password' => Hash::make('password123'),
            ]));
        });

        // ── ORGANISATEURS ─────────────────────────
        $fama = $users[0];
        $maguette = $users[1];
        $papi = $users[2];
        $awa = $users[3];
        $cheikh = $users[4];

        // ── RÉUNIONS ─────────────────────────
        $meetings = [
            [
                'organizer' => $fama,
                'title' => 'Sprint Review Q1',
                'description' => 'Présentation des features développées',
                'start_at' => now()->addDay()->setTime(14, 0),
                'duration' => 60,
                'location' => 'Google Meet',
                'reminder' => 15,
                'participants' => [$maguette, $papi],
            ],
            [
                'organizer' => $maguette,
                'title' => 'Design System UI',
                'description' => 'Refonte UX/UI globale',
                'start_at' => now()->addDays(2)->setTime(10, 30),
                'duration' => 90,
                'location' => 'Salle A',
                'reminder' => 30,
                'participants' => [$fama, $awa],
            ],
            [
                'organizer' => $papi,
                'title' => 'Backend Architecture',
                'description' => 'Optimisation API Laravel',
                'start_at' => now()->addDays(3)->setTime(9, 0),
                'duration' => 120,
                'location' => 'Zoom',
                'reminder' => 60,
                'participants' => [$fama, $maguette],
            ],
            [
                'organizer' => $awa,
                'title' => 'Marketing Strategy',
                'description' => 'Plan croissance produit',
                'start_at' => now()->addDays(4)->setTime(16, 0),
                'duration' => 45,
                'location' => 'Teams',
                'reminder' => 15,
                'participants' => [$fama, $papi],
            ],
            [
                'organizer' => $cheikh,
                'title' => 'DevOps & CI/CD',
                'description' => 'Mise en place pipeline CI/CD',
                'start_at' => now()->addDays(5)->setTime(11, 0),
                'duration' => 75,
                'location' => 'GitHub Meet',
                'reminder' => 20,
                'participants' => [$fama, $maguette, $papi],
            ],
        ];

        foreach ($meetings as $data) {
            $meeting = Meeting::create([
                'organizer_id'     => $data['organizer']->id,
                'title'            => $data['title'],
                'description'      => $data['description'],
                'start_at'         => $data['start_at'],
                'duration_minutes' => $data['duration'],
                'location'         => $data['location'],
                'reminder_minutes' => $data['reminder'],
            ]);

            // ── Invitations ─────────────────
            foreach ($data['participants'] as $user) {
                Invitation::create([
                    'meeting_id' => $meeting->id,
                    'user_id' => $user->id,
                    'status' => collect(['accepted', 'pending', 'refused'])->random(),
                    'responded_at' => now(),
                ]);
            }
        }

        // ── OUTPUT CONSOLE ─────────────────
        $this->command->info('🔥 Seeder PRO exécuté avec succès !');
        $this->command->info('Comptes de test (password: password123) :');
        $this->command->info('- nbineta2003@gmail.com');
        $this->command->info('- maguette@meetsync.app');
        $this->command->info('- papi@meetsync.app');
        $this->command->info('- awa@meetsync.app');
        $this->command->info('- cheikh@meetsync.app');
    }
}