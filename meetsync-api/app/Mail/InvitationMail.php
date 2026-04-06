<?php

namespace App\Mail;

use App\Models\Invitation;
use App\Models\Meeting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Meeting    $meeting,
        public Invitation $invitation
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Invitation : ' . $this->meeting->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.invitation',
            with: [
                'meeting'    => $this->meeting,
                'invitation' => $this->invitation,
                'acceptUrl'  => url('/api/invitations/' . $this->invitation->id . '/accept'),
                'refuseUrl'  => url('/api/invitations/' . $this->invitation->id . '/refuse'),
            ],
        );
    }
}